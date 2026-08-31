// Lightweight knowledge-base matcher for the assistant.
// No external NLP deps. Token overlap + intent bonus + weight.
//
// The assistant's job: given a user query, return the best entry from the
// union of KNOWLEDGE_STATIC and KNOWLEDGE_GENERATED. If nothing scores
// above the threshold, return the 'fallback' entry.

import { KNOWLEDGE_STATIC, type KnowledgeAction, type KnowledgeEntry } from '@/data/knowledge.static';

export type { KnowledgeAction, KnowledgeEntry };

export type KnowledgeCard =
  | { type: 'project'; projectId: string }
  | { type: 'skill_list'; category: string }
  | { type: 'contact' };

export type MatchResult = {
  entry: KnowledgeEntry;
  score: number;
  card?: KnowledgeCard;
};

// -- Synonym map: small but enough to handle obvious paraphrases. --
const SYNONYMS: Record<string, string[]> = {
  ai: ['artificial', 'intelligence', 'ml', 'machine', 'learning', 'llm', 'gpt', 'rag'],
  ml: ['machine', 'learning'],
  react: ['reactjs', 'react.js'],
  next: ['nextjs', 'next.js'],
  ts: ['typescript'],
  js: ['javascript'],
  cv: ['resume', 'curriculum', 'vitae'],
  contact: ['email', 'reach', 'touch', 'message', 'phone', 'call'],
  hire: ['availability', 'available', 'book', 'work', 'rate', 'rates', 'pricing'],
  price: ['rate', 'rates', 'pricing', 'cost', 'costs', 'fee', 'fees', 'budget'],
  kosovo: ['vushtrri', 'albania', 'balkans', 'location', 'where', 'based'],
  network: ['infrastructure', 'networking', 'dns', 'cdn'],
  compiler: ['language', 'apl', 'transpiler'],
  compilerLanguage: ['apl', 'aplplus', 'a++', 'apl++'],
};

const INTENT_KEYWORDS: Record<string, string[]> = {
  greeting: ['hi', 'hello', 'hey', 'yo', 'greetings', 'sup'],
  thanks: ['thanks', 'thank', 'thx', 'cheers', 'appreciate'],
  about: ['who', 'about', 'yourself', 'bio', 'introduce', 'introduction'],
  availability: ['available', 'availability', 'hire', 'hiring', 'open', 'free', 'taking', 'work'],
  rates: ['rate', 'rates', 'price', 'pricing', 'cost', 'costs', 'budget', 'fee', 'fees', 'charge'],
  process: ['process', 'workflow', 'how', 'start', 'working', 'together', 'engage'],
  stack: ['stack', 'tech', 'technology', 'tools', 'languages', 'framework'],
  ai: ['ai', 'artificial', 'intelligence', 'llm', 'gpt', 'ml', 'machine', 'learning', 'rag', 'agent', 'agents'],
  frontend: ['frontend', 'front-end', 'ui', 'ux', 'react', 'next'],
  backend: ['backend', 'back-end', 'api', 'server', 'node', 'python'],
  infrastructure: ['infra', 'infrastructure', 'network', 'cdn', 'deploy', 'devops', 'linux', 'vercel', 'netlify'],
  contact: ['contact', 'email', 'reach', 'message', 'phone', 'call', 'touch'],
  cv: ['cv', 'resume', 'curriculum', 'vitae'],
  location: ['where', 'location', 'based', 'live', 'from', 'country'],
  project: ['project', 'projects', 'work', 'portfolio', 'built', 'building', 'shipped'],
  easter_egg: ['coffee', 'sudo', 'matrix'],
};

const STOPWORDS = new Set([
  'a', 'an', 'and', 'or', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'is', 'are',
  'am', 'be', 'was', 'were', 'i', 'you', 'me', 'my', 'we', 'us', 'do', 'does', 'did',
  'can', 'could', 'will', 'would', 'should', 'tell', 'about', 'with', 'your', 'you',
  'it', 'its', 'that', 'this', 'what', 'how', 'when', 'where', 'why', 'who',
  're', 've', 'll', 'd', 's', 'm',
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function expandWithSynonyms(tokens: string[]): Set<string> {
  const out = new Set(tokens);
  for (const t of tokens) {
    if (SYNONYMS[t]) SYNONYMS[t].forEach(s => out.add(s));
  }
  return out;
}

function detectIntent(tokens: string[]): string | null {
  let bestIntent: string | null = null;
  let bestScore = 0;
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let s = 0;
    for (const t of tokens) {
      if (keywords.includes(t)) s += 1;
      // also match partial
      for (const k of keywords) {
        if (k.length > 3 && t.length > 3 && (k.includes(t) || t.includes(k))) s += 0.5;
      }
    }
    if (s > bestScore) {
      bestScore = s;
      bestIntent = intent;
    }
  }
  return bestScore >= 1 ? bestIntent : null;
}

function entryTokens(e: KnowledgeEntry): Set<string> {
  return expandWithSynonyms(tokenize(e.text + ' ' + e.intent + ' ' + (e.related ?? []).join(' ')));
}

export function matchKnowledge(
  query: string,
  entries: KnowledgeEntry[] = KNOWLEDGE_STATIC,
  opts: { threshold?: number; returnAll?: boolean } = {},
): MatchResult | MatchResult[] | null {
  const threshold = opts.threshold ?? 0.18;
  const q = query.trim();
  if (!q) return null;

  const queryTokens = tokenize(q);
  if (queryTokens.length === 0) return null;
  const queryExpanded = expandWithSynonyms(queryTokens);
  const intent = detectIntent(queryTokens);

  // Pre-compute entry tokens (with light caching via a single pass — no Map).
  const scored: MatchResult[] = [];
  for (const entry of entries) {
    const eTokens = entryTokens(entry);
    if (eTokens.size === 0) continue;
    let overlap = 0;
    for (const t of queryExpanded) if (eTokens.has(t)) overlap += 1;
    const tokenScore = overlap / Math.max(queryExpanded.size, 3);
    const intentBonus = intent && entry.intent.startsWith(intent) ? 0.3 : 0;
    const score = tokenScore * entry.weight + intentBonus;

    // Card inference: if the entry mentions a project, attach a card.
    let card: KnowledgeCard | undefined;
    if (entry.text.toLowerCase().includes('esmp')) card = { type: 'project', projectId: 'esmp' };
    else if (entry.text.toLowerCase().includes('a++(apl)') || entry.text.toLowerCase().includes('aplplus'))
      card = { type: 'project', projectId: 'apl' };
    else if (entry.text.toLowerCase().includes('forexpulse'))
      card = { type: 'project', projectId: 'forexpulse' };
    else if (entry.text.toLowerCase().includes('flixverse'))
      card = { type: 'project', projectId: 'flixverse' };
    else if (entry.text.toLowerCase().includes('foodery'))
      card = { type: 'project', projectId: 'foodery' };
    else if (entry.intent === 'contact') card = { type: 'contact' };

    scored.push({ entry, score, card });
  }

  scored.sort((a, b) => b.score - a.score);

  if (opts.returnAll) return scored;

  // Special-case: a clear intent with no good match still returns the top
  // entry of that intent if one exists.
  if (intent) {
    const sameIntent = scored.find(s => s.entry.intent === intent);
    if (sameIntent && sameIntent.score >= 0.15) return sameIntent;
  }

  const top = scored[0];
  if (!top) return null;
  if (top.score < threshold) {
    // Always return the fallback entry instead of nothing.
    const fallback = entries.find(e => e.intent === 'fallback');
    return fallback ? { entry: fallback, score: 0 } : top;
  }
  return top;
}
