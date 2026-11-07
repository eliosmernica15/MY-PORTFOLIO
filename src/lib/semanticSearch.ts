/**
 * Semantic Search System for Portfolio Projects
 *
 * Uses local embeddings via transformers.js for privacy-first,
 * offline-capable semantic search. Supports fallback to API-based
 * embeddings if needed.
 *
 * Features:
 * - Local embeddings via @xenova/transformers (all-MiniLM-L6-v2)
 * - In-memory vector index for fast similarity search
 * - Project metadata enrichment
 * - Fallback to API embeddings (OpenAI/Cohere) if configured
 * - Query expansion and re-ranking
 */

import { PROJECTS } from '@/data/projects';
import type { Project } from '@/types';

// ============================================================
// Types
// ============================================================

export interface SearchResult {
  project: Project;
  score: number;
  matchedFields: string[];
  snippet: string;
}

export interface SearchOptions {
  topK?: number;
  threshold?: number;
  includeSnippet?: boolean;
  queryExpansion?: boolean;
}

export interface EmbeddingConfig {
  model: 'local' | 'openai' | 'cohere';
  apiKey?: string;
  modelName?: string;
  dimensions?: number;
}

// ============================================================
// Embedding Provider Interface
// ============================================================

interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
  getDimensions(): number;
}

// ============================================================
// Local Embedding Provider (Transformers.js)
// ============================================================

let localEmbedder: any = null;
let isLocalModelLoading = false;

async function getLocalEmbedder(): Promise<any> {
  if (localEmbedder) return localEmbedder;
  if (isLocalModelLoading) {
    // Wait for existing load to complete
    while (isLocalModelLoading && !localEmbedder) {
      await new Promise(r => setTimeout(r, 100));
    }
    return localEmbedder;
  }

  isLocalModelLoading = true;
  try {
    // Dynamic import to avoid SSR issues
    const { pipeline } = await import('@xenova/transformers');
    localEmbedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true,
      progress_callback: (progress: any) => {
        if (progress.status === 'downloading') {
          console.log(`Downloading model: ${Math.round(progress.progress * 100)}%`);
        }
      },
    });
    isLocalModelLoading = false;
    return localEmbedder;
  } catch (error) {
    isLocalModelLoading = false;
    throw new Error(`Failed to load local embedding model: ${error}`);
  }
}

class LocalEmbeddingProvider implements EmbeddingProvider {
  async embed(text: string): Promise<number[]> {
    const embedder = await getLocalEmbedder();
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const embedder = await getLocalEmbedder();
    const results = await Promise.all(
      texts.map(text => embedder(text, { pooling: 'mean', normalize: true }))
    );
    return results.map(r => Array.from(r.data));
  }

  getDimensions(): number {
    return 384; // all-MiniLM-L6-v2 dimensions
  }
}

// ============================================================
// API Embedding Provider (OpenAI/Cohere)
// ============================================================

class APIEmbeddingProvider implements EmbeddingProvider {
  private config: EmbeddingConfig;

  constructor(config: EmbeddingConfig) {
    this.config = config;
  }

  async embed(text: string): Promise<number[]> {
    const batch = await this.embedBatch([text]);
    return batch[0];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (this.config.model === 'openai') {
      return this.embedOpenAI(texts);
    } else if (this.config.model === 'cohere') {
      return this.embedCohere(texts);
    }
    throw new Error(`Unknown API model: ${this.config.model}`);
  }

  private async embedOpenAI(texts: string[]): Promise<number[][]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.modelName || 'text-embedding-3-small',
        input: texts,
        encoding_format: 'float',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((d: any) => d.embedding);
  }

  private async embedCohere(texts: string[]): Promise<number[][]> {
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.modelName || 'embed-english-v3.0',
        texts: texts,
        input_type: 'search_document',
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embeddings;
  }

  getDimensions(): number {
    if (this.config.model === 'openai') return 1536; // text-embedding-3-small
    return 1024; // Cohere embed-english-v3.0
  }
}

// ============================================================
// Vector Index
// ============================================================

interface VectorIndexEntry {
  id: string;
  vector: number[];
  metadata: Record<string, any>;
}

interface SearchIndexResult {
  entry: VectorIndexEntry;
  score: number;
}

class VectorIndex {
  private entries: VectorIndexEntry[] = [];
  private dimensions: number = 0;

  constructor(dimensions: number = 384) {
    this.dimensions = dimensions;
  }

  add(id: string, vector: number[], metadata: Record<string, any> = {}): void {
    if (vector.length !== this.dimensions) {
      throw new Error(`Vector dimension mismatch: expected ${this.dimensions}, got ${vector.length}`);
    }
    this.entries.push({ id, vector, metadata });
  }

  addBatch(entries: Array<{ id: string; vector: number[]; metadata?: Record<string, any> }>): void {
    for (const entry of entries) {
      this.add(entry.id, entry.vector, entry.metadata || {});
    }
  }

  search(queryVector: number[], topK: number = 10, threshold: number = 0): SearchIndexResult[] {
    if (this.entries.length === 0) return [];

    // Cosine similarity
    const scores = this.entries.map(entry => ({
      entry,
      score: this.cosineSimilarity(queryVector, entry.vector),
    }));

    scores.sort((a, b) => b.score - a.score);

    return scores
      .filter(s => s.score >= threshold)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  getSize(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }

  // Serialize for caching
  serialize(): string {
    return JSON.stringify({
      dimensions: this.dimensions,
      entries: this.entries,
    });
  }

  // Deserialize from cache
  static deserialize(data: string): VectorIndex {
    const parsed = JSON.parse(data);
    const index = new VectorIndex(parsed.dimensions);
    index.entries = parsed.entries;
    return index;
  }
}

// ============================================================
// Project Text Extraction
// ============================================================

function extractProjectText(project: Project): string {
  const parts = [
    project.title,
    project.category,
    project.description,
    project.longDescription,
    ...project.tech,
    ...(project.highlights || []),
    ...(project.techRationale?.map(tr => `${tr.name}: ${tr.reason}`) || []),
    project.challenge || '',
    project.outcome || '',
    project.role || '',
  ].filter(Boolean);

  return parts.join(' ');
}

function extractProjectKeywords(project: Project): string[] {
  const keywords = new Set<string>();

  // Add title words
  project.title.split(/\s+/).forEach(w => keywords.add(w.toLowerCase()));

  // Add category
  keywords.add(project.category.toLowerCase());

  // Add tech stack
  project.tech.forEach(t => keywords.add(t.toLowerCase()));

  // Add category words
  project.category.split(/\s+/).forEach(w => keywords.add(w.toLowerCase()));

  // Add role
  if (project.role) {
    project.role.split(/\s+/).forEach(w => keywords.add(w.toLowerCase()));
  }

  return Array.from(keywords);
}

// ============================================================
// Semantic Search Engine
// ============================================================

class SemanticSearchEngine {
  private provider: EmbeddingProvider;
  private index: VectorIndex;
  private projectTexts: Map<string, string> = new Map();
  private projectKeywords: Map<string, string[]> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(provider?: EmbeddingProvider) {
    this.provider = provider || new LocalEmbeddingProvider();
    this.index = new VectorIndex(this.provider.getDimensions());
  }

  /**
   * Initialize the search engine with all projects
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInitialize();
    return this.initPromise;
  }

  private async doInitialize(): Promise<void> {
    console.log('[SemanticSearch] Initializing...');

    // Extract texts for all projects
    const projectEntries = PROJECTS.map(project => {
      const text = extractProjectText(project);
      const keywords = extractProjectKeywords(project);

      this.projectTexts.set(project.id, text);
      this.projectKeywords.set(project.id, keywords);

      return {
        id: project.id,
        text,
        metadata: {
          title: project.title,
          category: project.category,
          year: project.year,
          tech: project.tech,
        },
      };
    });

    // Generate embeddings in batches
    const batchSize = 10;
    const vectors: number[][] = [];

    for (let i = 0; i < projectEntries.length; i += batchSize) {
      const batch = projectEntries.slice(i, i + batchSize);
      const texts = batch.map(e => e.text);
      const embeddings = await this.provider.embedBatch(texts);
      vectors.push(...embeddings);
    }

    // Build index
    projectEntries.forEach((entry, i) => {
      this.index.add(entry.id, vectors[i], entry.metadata);
    });

    this.isInitialized = true;
    console.log(`[SemanticSearch] Initialized with ${this.index.getSize()} projects`);
  }

  /**
   * Search projects by natural language query
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    await this.initialize();

    const {
      topK = 10,
      threshold = 0.3,
      includeSnippet = true,
      queryExpansion = true,
    } = options;

    // Expand query if enabled
    let searchQuery = query;
    if (queryExpansion) {
      searchQuery = this.expandQuery(query);
    }

    // Generate query embedding
    const queryVector = await this.provider.embed(searchQuery);

    // Search index
    const entries = this.index.search(queryVector, topK, threshold);

    // Build results with snippets
    const results: SearchResult[] = entries.map(result => {
      const project = PROJECTS.find(p => p.id === result.entry.id);
      if (!project) throw new Error(`Project not found: ${result.entry.id}`);

      const snippet = includeSnippet
        ? this.generateSnippet(project, searchQuery)
        : '';

      const matchedFields = this.getMatchedFields(project, searchQuery);

      // Use the similarity score from the index search directly
      // The index.search method already returns cosine similarity scores
      return {
        project,
        score: result.score || 0,
        matchedFields,
        snippet,
      };
    });

    // Re-rank with keyword matching
    return this.reRankResults(results, searchQuery);
  }

  /**
   * Expand query with synonyms and related terms
   */
  private expandQuery(query: string): string {
    const expansions: Record<string, string[]> = {
      'ai': ['artificial intelligence', 'machine learning', 'ml', 'neural network'],
      'ml': ['machine learning', 'artificial intelligence', 'deep learning'],
      'backend': ['server', 'api', 'server-side', 'node', 'python'],
      'frontend': ['ui', 'client', 'react', 'vue', 'angular', 'web'],
      'fullstack': ['full-stack', 'full stack', 'frontend', 'backend'],
      'mobile': ['ios', 'android', 'react native', 'flutter'],
      'devops': ['deployment', 'ci/cd', 'docker', 'kubernetes', 'infrastructure'],
      'database': ['db', 'sql', 'nosql', 'postgres', 'mongodb', 'redis'],
      'auth': ['authentication', 'authorization', 'login', 'oauth', 'jwt'],
      'realtime': ['websockets', 'socket.io', 'live', 'sync'],
      'performance': ['optimization', 'speed', 'fast', 'latency', 'throughput'],
    };

    const words = query.toLowerCase().split(/\s+/);
    const expanded = [...words];

    for (const word of words) {
      if (expansions[word]) {
        expanded.push(...expansions[word]);
      }
    }

    return [...new Set(expanded)].join(' ');
  }

  /**
   * Generate snippet highlighting matched terms
   */
  private generateSnippet(project: Project, query: string): string {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const text = this.projectTexts.get(project.id) || '';

    // Find best matching sentence
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);

    let bestSentence = '';
    let bestScore = 0;

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      let score = 0;
      for (const word of queryWords) {
        if (lowerSentence.includes(word)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestSentence = sentence.trim();
      }
    }

    return bestSentence || text.slice(0, 200);
  }

  /**
   * Get which fields matched the query
   */
  private getMatchedFields(project: Project, query: string): string[] {
    const queryLower = query.toLowerCase();
    const fields: string[] = [];

    if (project.title.toLowerCase().includes(queryLower)) fields.push('title');
    if (project.category.toLowerCase().includes(queryLower)) fields.push('category');
    if (project.description.toLowerCase().includes(queryLower)) fields.push('description');
    if (project.longDescription.toLowerCase().includes(queryLower)) fields.push('longDescription');
    if (project.tech.some(t => t.toLowerCase().includes(queryLower))) fields.push('tech');
    if (project.highlights?.some(h => h.toLowerCase().includes(queryLower))) fields.push('highlights');
    if (project.challenge?.toLowerCase().includes(queryLower)) fields.push('challenge');
    if (project.outcome?.toLowerCase().includes(queryLower)) fields.push('outcome');

    return fields;
  }

  /**
   * Re-rank results combining semantic and keyword scores
   */
  private reRankResults(results: SearchResult[], query: string): SearchResult[] {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    return results.map(result => {
      let keywordScore = 0;
      const project = result.project;

      for (const word of queryWords) {
        if (project.title.toLowerCase().includes(word)) keywordScore += 10;
        if (project.category.toLowerCase().includes(word)) keywordScore += 5;
        if (project.tech.some(t => t.toLowerCase().includes(word))) keywordScore += 8;
        if (project.description.toLowerCase().includes(word)) keywordScore += 3;
      }

      // Combine semantic and keyword scores (70/30)
      const combinedScore = result.score * 0.7 + (keywordScore / 100) * 0.3;

      return { ...result, score: combinedScore };
    }).sort((a, b) => b.score - a.score);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0) return 0;
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Get similar projects to a given project
   */
  async getSimilarProjects(projectId: string, topK: number = 5): Promise<SearchResult[]> {
    await this.initialize();

    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    // Use project text as query
    const text = this.projectTexts.get(projectId) || '';
    const queryVector = await this.provider.embed(text);

    const entries = this.index.search(queryVector, topK + 1);
    const filtered = entries.filter(e => e.entry.id !== projectId).slice(0, topK);

    return filtered.map(result => {
      const project = PROJECTS.find(p => p.id === result.entry.id);
      if (!project) throw new Error(`Project not found: ${result.entry.id}`);
      return {
        project,
        score: result.score || 0,
        matchedFields: [],
        snippet: '',
      };
    });
  }

  /**
   * Search by category
   */
  async searchByCategory(category: string, topK: number = 10): Promise<SearchResult[]> {
    const categoryProjects = PROJECTS.filter(p => p.category === category).slice(0, topK);
    return categoryProjects.map(project => ({
      project,
      score: 1,
      matchedFields: ['category'],
      snippet: project.description,
    }));
  }

  /**
   * Search by technology
   */
  async searchByTech(tech: string, topK: number = 10): Promise<SearchResult[]> {
    const techProjects = PROJECTS.filter(p =>
      p.tech.some(t => t.toLowerCase().includes(tech.toLowerCase()))
    ).slice(0, topK);

    return techProjects.map(project => ({
      project,
      score: 1,
      matchedFields: ['tech'],
      snippet: project.description,
    }));
  }
}

// ============================================================
// Singleton Instance & Export
// ============================================================

let searchEngineInstance: SemanticSearchEngine | null = null;

export function getSearchEngine(provider?: EmbeddingProvider): SemanticSearchEngine {
  if (!searchEngineInstance) {
    searchEngineInstance = new SemanticSearchEngine(provider);
  }
  return searchEngineInstance;
}

export function setSearchEngineProvider(provider: EmbeddingProvider): void {
  searchEngineInstance = new SemanticSearchEngine(provider);
}

// ============================================================
// Server Action for API-based Search
// ============================================================

/**
 * Server action for semantic search (uses API embeddings if configured)
 * This can be called from client components
 */
export async function semanticSearchAction(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
  const engine = getSearchEngine();
  return engine.search(query, options);
}

// ============================================================
// Export Types
// ============================================================

// Types (EmbeddingProvider, EmbeddingConfig, SearchResult, SearchOptions) and classes
// are already exported at their definitions - no explicit re-exports needed