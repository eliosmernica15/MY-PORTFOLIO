/**
 * Auto-Generated Case Studies from Project Data
 *
 * Generates detailed, well-structured case studies from project metadata
 * using template-based generation with optional LLM enhancement.
 *
 * Features:
 * - Template-based generation (works offline)
 * - Optional LLM enhancement via API
 * - Structured sections: Challenge, Solution, Architecture, Results, Lessons
 * - Technical depth adjustable (executive vs technical)
 * - Export formats: HTML, Markdown, JSON
 * - SEO-optimized output
 */

import { PROJECTS } from '@/data/projects';
import type { Project } from '@/types';

// ============================================================
// Types
// ============================================================

export interface CaseStudy {
  projectId: string;
  title: string;
  slug: string;
  executiveSummary: string;
  challenge: string;
  solution: string;
  architecture: string;
  implementation: string;
  results: CaseStudyResults;
  technologies: string[];
  lessonsLearned: string[];
  timeline: string;
  teamSize: string;
  role: string;
  seo: CaseStudySEO;
  generatedAt: string;
  version: number;
}

export interface CaseStudyResults {
  metrics: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  qualitative: string[];
  testimonials?: string[];
}

export interface CaseStudySEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  structuredData: Record<string, any>;
}

export interface GenerationOptions {
  depth: 'executive' | 'technical' | 'deep-dive';
  includeCodeSnippets: boolean;
  includeDiagrams: boolean;
  tone: 'professional' | 'conversational' | 'technical';
  format: 'html' | 'markdown' | 'json';
  useLLM: boolean;
  llmProvider?: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
}

// ============================================================
// Template System
// ============================================================

const EXECUTIVE_SUMMARY_TEMPLATE = `{{projectName}} is a {{category}} project that {{description}}. Built with {{techStack}}, the project {{outcome}}. {{challenge}} The solution delivered {{resultsSummary}} in {{duration}}.`;

const CHALLENGE_TEMPLATE = `## The Challenge

{{challenge}}

### Context
{{context}}

### Key Constraints
{{constraints}}

### Success Criteria
{{successCriteria}}`;

const SOLUTION_TEMPLATE = `## The Solution

{{solutionOverview}}

### Approach
{{approach}}

### Key Design Decisions
{{designDecisions}}

### Technology Stack
{{techStackRationale}}`;

const ARCHITECTURE_TEMPLATE = `## Architecture

### High-Level Overview
{{architectureOverview}}

### Component Diagram
{{componentDiagram}}

### Data Flow
{{dataFlow}}

### Infrastructure
{{infrastructure}}`;

const IMPLEMENTATION_TEMPLATE = `## Implementation

### Development Process
{{developmentProcess}}

### Key Features Implemented
{{keyFeatures}}

### Code Highlights
{{codeHighlights}}

### Testing Strategy
{{testingStrategy}}`;

const RESULTS_TEMPLATE = `## Results & Impact

### Quantitative Results
{{quantitativeResults}}

### Qualitative Impact
{{qualitativeImpact}}

### Testimonials
{{testimonials}}`;

const LESSONS_TEMPLATE = `## Lessons Learned

### What Worked Well
{{whatWorked}}

### What Could Be Improved
{{improvements}}

### Advice for Future Projects
{{advice}}`;

// ============================================================
// Template Engine
// ============================================================

function renderTemplate(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value || '');
  }
  return result;
}

// ============================================================
// Case Study Generator
// ============================================================

export class CaseStudyGenerator {
  private options: GenerationOptions;

  constructor(options: Partial<GenerationOptions> = {}) {
    this.options = {
      depth: 'technical',
      includeCodeSnippets: true,
      includeDiagrams: false,
      tone: 'professional',
      format: 'markdown',
      useLLM: false,
      ...options,
    };
  }

  /**
   * Generate a case study for a project
   */
  async generate(project: Project): Promise<CaseStudy> {
    const data = this.prepareData(project);

    const executiveSummary = this.generateExecutiveSummary(data);
    const challenge = this.generateChallenge(data);
    const solution = this.generateSolution(data);
    const architecture = this.generateArchitecture(data);
    const implementation = this.generateImplementation(data);
    const results = this.generateResults(data);
    const lessonsLearned = this.generateLessons(data);
    const seo = this.generateSEO(project);

    return {
      projectId: project.id,
      title: `${project.title} — Case Study`,
      slug: `${project.id}-case-study`,
      executiveSummary,
      challenge,
      solution,
      architecture,
      implementation,
      results,
      technologies: project.tech,
      lessonsLearned: this.extractLessons(data),
      timeline: project.duration || 'Not specified',
      teamSize: '1 (Solo)',
      role: project.role || 'Solo Developer',
      seo,
      generatedAt: new Date().toISOString(),
      version: 1,
    };
  }

  /**
   * Prepare data for templates
   */
  private prepareData(project: Project): Record<string, string> {
    const techStack = project.tech.join(', ');
    const highlights = project.highlights?.join('; ') || 'N/A';
    const metrics = project.metrics?.map(m => `${m.label}: ${m.value}${m.suffix || ''}`).join('; ') || 'N/A';

    return {
      projectName: project.title,
      category: project.category,
      description: project.description,
      longDescription: project.longDescription,
      techStack,
      outcome: project.outcome || 'delivered significant value',
      challenge: project.challenge || 'Complex technical challenges requiring innovative solutions',
      context: this.generateContext(project),
      constraints: this.generateConstraints(project),
      successCriteria: this.generateSuccessCriteria(project),
      solutionOverview: project.longDescription,
      approach: this.generateApproach(project),
      designDecisions: this.generateDesignDecisions(project),
      techStackRationale: this.generateTechRationale(project),
      architectureOverview: this.generateArchitectureOverview(project),
      componentDiagram: this.generateComponentDiagram(project),
      dataFlow: this.generateDataFlow(project),
      infrastructure: this.generateInfrastructure(project),
      developmentProcess: this.generateDevelopmentProcess(project),
      keyFeatures: highlights,
      codeHighlights: this.generateCodeHighlights(project),
      testingStrategy: this.generateTestingStrategy(project),
      quantitativeResults: metrics,
      qualitativeImpact: project.outcome || 'Positive user feedback and measurable performance improvements',
      testimonials: 'N/A',
      whatWorked: this.generateWhatWorked(project),
      improvements: this.generateImprovements(project),
      advice: this.generateAdvice(project),
      resultsSummary: this.generateResultsSummary(project),
      duration: project.duration || 'several months',
    };
  }

  // ============================================================
  // Section Generators
  // ============================================================

  private generateExecutiveSummary(data: Record<string, string>): string {
    return renderTemplate(EXECUTIVE_SUMMARY_TEMPLATE, data);
  }

  private generateChallenge(data: Record<string, string>): string {
    return renderTemplate(CHALLENGE_TEMPLATE, data);
  }

  private generateSolution(data: Record<string, string>): string {
    return renderTemplate(SOLUTION_TEMPLATE, data);
  }

  private generateArchitecture(data: Record<string, string>): string {
    if (this.options.depth === 'executive') {
      return 'Architecture details available in technical version.';
    }
    return renderTemplate(ARCHITECTURE_TEMPLATE, data);
  }

  private generateImplementation(data: Record<string, string>): string {
    if (this.options.depth === 'executive') {
      return 'Implementation details available in technical version.';
    }
    return renderTemplate(IMPLEMENTATION_TEMPLATE, data);
  }

  private generateResults(data: Record<string, string>): CaseStudyResults {
    return {
      metrics: [
        { label: 'Development Time', value: data.duration },
        { label: 'Technologies Used', value: data.techStack.split(',').length.toString() },
      ],
      qualitative: [data.qualitativeImpact],
    };
  }

  private generateLessons(data: Record<string, string>): string {
    return renderTemplate(LESSONS_TEMPLATE, data);
  }

  private generateSEO(project: Project): CaseStudySEO {
    const baseUrl = 'https://eliosmernica.vercel.app';
    const slug = `${project.id}-case-study`;

    return {
      metaTitle: `${project.title} Case Study — ${project.category} Project by Elios Mernica`,
      metaDescription: `Read the detailed case study for ${project.title}, a ${project.category} project built with ${project.tech.join(', ')}. ${project.description}`,
      canonicalUrl: `${baseUrl}/case-studies/${slug}`,
      ogImage: project.image,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CaseStudy',
        name: `${project.title} Case Study`,
        description: project.longDescription,
        image: project.image,
        author: {
          '@type': 'Person',
          name: 'Elios Mernica',
        },
        datePublished: new Date().toISOString(),
        keywords: ['case study', 'portfolio', 'software engineering', project.category, ...project.tech],
      },
    };
  }

  private extractLessons(data: Record<string, string>): string[] {
    return [
      data.advice || 'Start with clear requirements and iterate quickly.',
      'Choose technologies that match team expertise and project requirements.',
      'Invest in testing and monitoring from day one.',
      'Document architecture decisions for future maintainers.',
    ];
  }

  // ============================================================
  // Helper Data Generators
  // ============================================================

  private generateContext(project: Project): string {
    return `${project.title} was developed to address ${project.challenge?.toLowerCase() || 'a specific need in the market'}. The project falls under ${project.category} and targets users who need ${project.description.toLowerCase()}.`;
  }

  private generateConstraints(project: Project): string {
    const constraints = [
      `Solo development (${project.role || 'solo developer'})`,
      `Timeline: ${project.duration || 'flexible'}`,
      `Technology choices limited to: ${project.tech.join(', ')}`,
    ];
    return constraints.join('\n- ');
  }

  private generateSuccessCriteria(project: Project): string {
    return `- Deliver a working ${project.category.toLowerCase()} solution\n- Achieve ${project.outcome || 'measurable results'}\n- Maintain code quality and performance\n- Ensure scalability for future growth`;
  }

  private generateApproach(project: Project): string {
    return `The project followed an iterative development approach, starting with a minimal viable product and incrementally adding features based on ${project.category} requirements. The technology stack (${project.tech.join(', ')}) was chosen for its ${project.tech.length > 3 ? 'robustness and ecosystem maturity' : 'simplicity and developer experience'}.`;
  }

  private generateDesignDecisions(project: Project): string {
    return `- **Language/Framework**: ${project.tech.slice(0, 2).join(', ')} for ${project.category} development\n- **Architecture**: Modular, component-based structure\n- **State Management**: Appropriate for project scale\n- **Deployment**: Optimized for performance and SEO`;
  }

  private generateTechRationale(project: Project): string {
    return project.techRationale?.map(tr => `- **${tr.name}**: ${tr.reason}`).join('\n') ||
      project.tech.map(t => `- **${t}**: Chosen for its suitability in ${project.category} development`).join('\n');
  }

  private generateArchitectureOverview(project: Project): string {
    return `${project.title} follows a modern ${project.category.toLowerCase()} architecture with clear separation of concerns. The system is designed for scalability, maintainability, and performance.`;
  }

  private generateComponentDiagram(project: Project): string {
    return this.options.includeDiagrams
      ? `![Component Diagram](${project.image})\n\n*Component architecture for ${project.title}*`
      : 'Component diagram available in technical documentation.';
  }

  private generateDataFlow(project: Project): string {
    return `Data flows through the system in a unidirectional pattern: User Input → Validation → Processing → Storage → Response. Caching layers optimize read-heavy operations.`;
  }

  private generateInfrastructure(project: Project): string {
    return `Deployed on Vercel with edge caching, automatic HTTPS, and global CDN. CI/CD via GitHub Actions with preview deployments for every PR.`;
  }

  private generateDevelopmentProcess(project: Project): string {
    return `Developed using test-driven development with continuous integration. Code reviews for all changes. Feature flags for safe rollouts.`;
  }

  private generateCodeHighlights(project: Project): string {
    if (!this.options.includeCodeSnippets) return 'Code snippets available in repository.';
    return `Key implementation patterns used in ${project.title} demonstrate modern ${project.category.toLowerCase()} best practices.`;
  }

  private generateTestingStrategy(project: Project): string {
    return 'Unit tests for business logic, integration tests for API endpoints, E2E tests for critical user flows. Coverage target: >80%.';
  }

  private generateWhatWorked(project: Project): string {
    return `- Technology choices aligned with project requirements\n- Iterative development enabled rapid feedback\n- Performance optimization from day one`;
  }

  private generateImprovements(project: Project): string {
    return `- More comprehensive documentation from the start\n- Earlier integration of monitoring/observability\n- More comprehensive test coverage for edge cases`;
  }

  private generateAdvice(project: Project): string {
    return `For similar ${project.category} projects: start with a clear architecture, choose proven technologies, invest in developer experience, and measure everything from day one.`;
  }

  private generateResultsSummary(project: Project): string {
    return `${project.outcome || 'successful delivery'} within ${project.duration || 'the planned timeline'}`;
  }
}

// ============================================================
// LLM Enhancement (Optional)
// ============================================================

interface LLMProvider {
  enhance(text: string, prompt: string): Promise<string>;
}

class OpenAIProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4-turbo-preview') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async enhance(text: string, prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: text },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || text;
  }
}

/**
 * Enhance case study with LLM
 */
export async function enhanceCaseStudyWithLLM(
  caseStudy: CaseStudy,
  provider: LLMProvider,
  options: GenerationOptions
): Promise<CaseStudy> {
  if (!options.useLLM) return caseStudy;

  const sections = [
    { key: 'executiveSummary', prompt: 'Enhance this executive summary to be more compelling and concise, highlighting business value.' },
    { key: 'challenge', prompt: 'Rewrite this challenge section to be more compelling, emphasizing the business problem and technical complexity.' },
    { key: 'solution', prompt: 'Enhance this solution section with more technical depth and clarity.' },
    { key: 'architecture', prompt: 'Add more architectural detail and trade-offs discussed.' },
    { key: 'implementation', prompt: 'Add specific implementation details, patterns, and best practices used.' },
    { key: 'lessonsLearned', prompt: 'Make lessons learned more actionable and specific.' },
  ];

  const enhanced = { ...caseStudy };

  for (const section of sections) {
    const currentText = (enhanced as any)[section.key];
    if (currentText) {
      try {
        (enhanced as any)[section.key] = await provider.enhance(currentText, section.prompt);
      } catch (error) {
        console.warn(`Failed to enhance ${section.key}:`, error);
      }
    }
  }

  enhanced.version += 1;
  return enhanced;
}

// ============================================================
// Export Functions
// ============================================================

/**
 * Generate case studies for all projects
 */
export async function generateAllCaseStudies(
  options: Partial<GenerationOptions> = {}
): Promise<CaseStudy[]> {
  const generator = new CaseStudyGenerator(options);
  const studies = await Promise.all(
    PROJECTS.map(project => generator.generate(project))
  );
  return studies;
}

/**
 * Generate single case study
 */
export async function generateCaseStudy(
  projectId: string,
  options: Partial<GenerationOptions> = {}
): Promise<CaseStudy | null> {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return null;

  const generator = new CaseStudyGenerator(options);
  return generator.generate(project);
}

/**
 * Export case study to different formats
 */
export function exportCaseStudy(
  caseStudy: CaseStudy,
  format: 'html' | 'markdown' | 'json'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(caseStudy, null, 2);
    case 'markdown':
      return caseStudyToMarkdown(caseStudy);
    case 'html':
      return caseStudyToHTML(caseStudy);
    default:
      return caseStudyToMarkdown(caseStudy);
  }
}

function caseStudyToMarkdown(cs: CaseStudy): string {
  return `# ${cs.title}

## Executive Summary
${cs.executiveSummary}

${cs.challenge}

${cs.solution}

${cs.architecture}

${cs.implementation}

## Results & Impact
${JSON.stringify(cs.results, null, 2)}

## Lessons Learned
${cs.lessonsLearned.map(l => `- ${l}`).join('\n')}

---
*Generated on ${new Date(cs.generatedAt).toLocaleDateString()} | Version ${cs.version}`;
}

function caseStudyToHTML(cs: CaseStudy): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cs.title}</title>
  <meta name="description" content="${cs.seo.metaDescription}">
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1, h2, h3 { color: #1a1a1a; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
    pre { background: #1a1a1a; color: #e0e0e0; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <article>
    <header>
      <h1>${cs.title}</h1>
      <p class="meta">Generated on ${new Date(cs.generatedAt).toLocaleDateString()} | Version ${cs.version}</p>
    </header>
    <section>
      <h2>Executive Summary</h2>
      <p>${cs.executiveSummary}</p>
    </section>
    ${cs.challenge}
    ${cs.solution}
    ${cs.architecture}
    ${cs.implementation}
    <section>
      <h2>Results & Impact</h2>
      <pre>${JSON.stringify(cs.results, null, 2)}</pre>
    </section>
    <section>
      <h2>Lessons Learned</h2>
      <ul>${cs.lessonsLearned.map(l => `<li>${l}</li>`).join('')}</ul>
    </section>
  </article>
</body>
</html>`;
}

// ============================================================
// Export
// ============================================================

// Types are already exported at their definition (export interface)
// No need for explicit re-export