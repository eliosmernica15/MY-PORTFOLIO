/**
 * Skill Gap Analysis Feature
 *
 * Analyzes a user's skills and compares them against job descriptions,
 * project requirements, or target roles to suggest personalized learning paths.
 *
 * Features:
 * - Skill proficiency mapping (1-5 scale)
 * - Job description parsing and skill extraction
 * - Gap analysis with priority scoring
 * - Personalized learning path generation
 * - Resource recommendations (courses, docs, projects)
 * - Progress tracking
 * - Export to learning plan (JSON, Markdown)
 */

import { SKILL_CATEGORIES } from '@/data/skills';
import { PROJECTS } from '@/data/projects';
import type { Skill, Project } from '@/types';

// ============================================================
// Types
// ============================================================

export interface UserSkill {
  name: string;
  category: string;
  proficiency: number; // 1-5 scale
  yearsExperience?: number;
  lastUsed?: string; // ISO date
  confidence: number; // 0-1 self-assessment confidence
}

export interface UserProfile {
  id: string;
  name: string;
  currentRole: string;
  targetRole?: string;
  skills: UserSkill[];
  experienceYears: number;
  education?: string;
  preferences: {
    learningStyle: 'visual' | 'hands-on' | 'reading' | 'mixed';
    timeCommitment: number; // hours per week
    budget: number; // monthly budget in USD
    preferredResources: ('video' | 'article' | 'course' | 'book' | 'project' | 'documentation')[];
  };
}

export interface JobRequirement {
  skill: string;
  category: string;
  requiredLevel: number; // 1-5
  importance: 'critical' | 'important' | 'nice-to-have';
  weight: number; // 0-1
}

export interface JobProfile {
  id: string;
  title: string;
  company?: string;
  description: string;
  requirements: JobRequirement[];
  salaryRange?: { min: number; max: number; currency: string };
  location?: string;
  remote?: boolean;
}

export interface SkillGap {
  skill: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number; // required - current (negative = surplus)
  importance: 'critical' | 'important' | 'nice-to-have';
  priority: number; // 0-100 composite score
  recommendation: LearningRecommendation;
}

export interface LearningRecommendation {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  resources: LearningResource[];
  milestones: Milestone[];
  prerequisites: string[];
}

export interface LearningResource {
  title: string;
  type: 'course' | 'article' | 'video' | 'book' | 'project' | 'documentation';
  url: string;
  provider: string;
  duration: string; // e.g., "4 hours", "2 weeks"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cost: number; // 0 for free
  rating?: number; // 1-5
  tags: string[];
}

export interface Milestone {
  title: string;
  description: string;
  estimatedHours: number;
  skillsGained: string[];
  verification: string; // How to verify completion
}

export interface SkillGapAnalysisResult {
  userProfile: UserProfile;
  targetProfile: JobProfile | Project;
  overallMatch: number; // 0-100
  gaps: SkillGap[];
  strengths: SkillGap[]; // Skills exceeding requirements
  learningPath: LearningPath;
  summary: string;
  generatedAt: string;
}

export interface LearningPath {
  phases: LearningPhase[];
  totalEstimatedHours: number;
  estimatedWeeks: number;
  weeklyCommitment: number;
}

export interface LearningPhase {
  name: string;
  description: string;
  skills: string[];
  estimatedHours: number;
  resources: LearningResource[];
  prerequisites: string[];
  order: number;
}

// ============================================================
// Skill Database & Mappings
// ============================================================

// Extended skill database with related skills, prerequisites, and resources
export interface SkillInfo {
  name: string;
  category: string;
  relatedSkills: string[];
  prerequisites: string[];
  learningResources: LearningResource[];
  typicalLevels: {
    beginner: string;
    intermediate: string;
    advanced: string;
    expert: string;
  };
}

// Comprehensive skill database
export const SKILL_DATABASE: Record<string, SkillInfo> = {
  // Languages
  'TypeScript': {
    name: 'TypeScript',
    category: 'Languages',
    relatedSkills: ['JavaScript', 'Node.js', 'React', 'Node.js'],
    prerequisites: ['JavaScript'],
    learningResources: [
      { title: 'TypeScript Handbook', type: 'documentation', url: 'https://www.typescriptlang.org/docs/', provider: 'Microsoft', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Effective TypeScript', type: 'book', url: 'https://effectivetypescript.com/', provider: 'Dan Vanderkam', duration: '8 hours', difficulty: 'intermediate', cost: 30, tags: ['best-practices'] },
      { title: 'TypeScript Deep Dive', type: 'course', url: 'https://basarat.gitbook.io/typescript/', provider: 'Basarat Ali Syed', duration: '6 hours', difficulty: 'intermediate', cost: 0, tags: ['free', 'comprehensive'] },
    ],
    typicalLevels: {
      beginner: 'Basic types, interfaces, type inference',
      intermediate: 'Generics, utility types, conditional types',
      advanced: 'Template literal types, mapped types, type-level programming',
      expert: 'Compiler internals, custom transformers, language server extensions',
    },
  },
  'React': {
    name: 'React',
    category: 'Frontend',
    relatedSkills: ['TypeScript', 'JavaScript', 'Next.js', 'Redux', 'Tailwind CSS'],
    prerequisites: ['JavaScript', 'HTML/CSS'],
    learningResources: [
      { title: 'React Official Tutorial', type: 'documentation', url: 'https://react.dev/learn', provider: 'Meta', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Epic React', type: 'course', url: 'https://epicreact.dev/', provider: 'Kent C. Dodds', duration: '20 hours', difficulty: 'intermediate', cost: 599, tags: ['comprehensive', 'patterns'] },
      { title: 'React Patterns', type: 'article', url: 'https://reactpatterns.com/', provider: 'Community', duration: '2 hours', difficulty: 'intermediate', cost: 0, tags: ['patterns', 'free'] },
    ],
    typicalLevels: {
      beginner: 'Components, props, state, hooks basics',
      intermediate: 'Custom hooks, context, performance optimization',
      advanced: 'Compound components, render props, suspense, concurrent features',
      expert: 'React internals, custom renderers, library authoring',
    },
  },
  'Next.js': {
    name: 'Next.js',
    category: 'Frontend',
    relatedSkills: ['React', 'TypeScript', 'Vercel', 'Server Components'],
    prerequisites: ['React', 'JavaScript'],
    learningResources: [
      { title: 'Next.js Documentation', type: 'documentation', url: 'https://nextjs.org/docs', provider: 'Vercel', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Next.js Mastery', type: 'course', url: 'https://nextjs.org/learn', provider: 'Vercel', duration: '8 hours', difficulty: 'intermediate', cost: 0, tags: ['official', 'free'] },
    ],
    typicalLevels: {
      beginner: 'Pages, routing, basic data fetching',
      intermediate: 'App router, server components, middleware',
      advanced: 'Edge runtime, streaming, custom server',
      expert: 'Custom plugins, Turbopack, core contributions',
    },
  },
  'Node.js': {
    name: 'Node.js',
    category: 'Backend',
    relatedSkills: ['TypeScript', 'Express', 'Fastify', 'PostgreSQL', 'Redis'],
    prerequisites: ['JavaScript'],
    learningResources: [
      { title: 'Node.js Documentation', type: 'documentation', url: 'https://nodejs.org/en/docs/', provider: 'Node.js Foundation', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Node.js Design Patterns', type: 'book', url: 'https://www.nodejsdesignpatterns.com/', provider: 'Mario Casciaro', duration: '12 hours', difficulty: 'intermediate', cost: 40, tags: ['patterns', 'architecture'] },
    ],
    typicalLevels: {
      beginner: 'Event loop, modules, npm, basic APIs',
      intermediate: 'Streams, clustering, worker threads, native addons',
      advanced: 'Performance profiling, memory management, custom bindings',
      expert: 'Core contributions, V8 internals, libuv',
    },
  },
  'Python': {
    name: 'Python',
    category: 'Languages',
    relatedSkills: ['FastAPI', 'Django', 'Data Science', 'AI/ML'],
    prerequisites: [],
    learningResources: [
      { title: 'Python Official Tutorial', type: 'documentation', url: 'https://docs.python.org/3/tutorial/', provider: 'PSF', duration: '6 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Effective Python', type: 'book', url: 'https://effectivepython.com/', provider: 'Brett Slatkin', duration: '10 hours', difficulty: 'intermediate', cost: 40, tags: ['best-practices'] },
    ],
    typicalLevels: {
      beginner: 'Syntax, data structures, functions, modules',
      intermediate: 'Decorators, generators, context managers, async/await',
      advanced: 'Metaclasses, descriptors, C extensions, profiling',
      expert: 'CPython internals, GIL, memory management',
    },
  },
  'PostgreSQL': {
    name: 'PostgreSQL',
    category: 'Database',
    relatedSkills: ['SQL', 'Database Design', 'Prisma', 'Redis'],
    prerequisites: ['SQL Basics'],
    learningResources: [
      { title: 'PostgreSQL Documentation', type: 'documentation', url: 'https://www.postgresql.org/docs/', provider: 'PostgreSQL Global Development Group', duration: '6 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'PostgreSQL High Performance', type: 'book', url: 'https://www.postgresql.org/docs/current/performance-tips.html', provider: 'PostgreSQL', duration: '8 hours', difficulty: 'intermediate', cost: 0, tags: ['performance', 'free'] },
    ],
    typicalLevels: {
      beginner: 'Basic queries, joins, indexes, constraints',
      intermediate: 'Window functions, CTEs, partitioning, replication',
      advanced: 'Query planning, tuning, extensions, custom types',
      expert: 'Internals, WAL, custom extensions, core development',
    },
  },
  'Docker': {
    name: 'Docker',
    category: 'DevOps',
    relatedSkills: ['Kubernetes', 'CI/CD', 'Linux', 'Networking'],
    prerequisites: ['Linux Basics'],
    learningResources: [
      { title: 'Docker Documentation', type: 'documentation', url: 'https://docs.docker.com/', provider: 'Docker Inc.', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Docker Deep Dive', type: 'course', url: 'https://dockerlabs.collabnix.com/', provider: 'Community', duration: '8 hours', difficulty: 'intermediate', cost: 0, tags: ['free', 'hands-on'] },
    ],
    typicalLevels: {
      beginner: 'Images, containers, Dockerfile, docker-compose',
      intermediate: 'Multi-stage builds, networking, volumes, swarm mode',
      advanced: 'BuildKit, Buildx, security, Kubernetes integration',
      expert: 'Container runtimes, containerd, CRI, kernel namespaces',
    },
  },
  'AWS': {
    name: 'AWS',
    category: 'Cloud',
    relatedSkills: ['Docker', 'Terraform', 'Kubernetes', 'Serverless'],
    prerequisites: ['Cloud Concepts', 'Networking Basics'],
    learningResources: [
      { title: 'AWS Skill Builder', type: 'course', url: 'https://skillbuilder.aws/', provider: 'AWS', duration: '20 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free', 'certification-prep'] },
      { title: 'AWS Certified Solutions Architect', type: 'course', url: 'https://aws.amazon.com/certification/', provider: 'AWS', duration: '40 hours', difficulty: 'intermediate', cost: 150, tags: ['certification'] },
    ],
    typicalLevels: {
      beginner: 'Core services (EC2, S3, RDS, Lambda), IAM basics',
      intermediate: 'VPC, CloudFormation, monitoring, cost optimization',
      advanced: 'Architecture patterns, migration, hybrid, security',
      expert: 'Custom solutions, edge cases, core contributions',
    },
  },
  'GraphQL': {
    name: 'GraphQL',
    category: 'API',
    relatedSkills: ['TypeScript', 'Apollo', 'React', 'Node.js'],
    prerequisites: ['REST APIs', 'TypeScript'],
    learningResources: [
      { title: 'GraphQL Documentation', type: 'documentation', url: 'https://graphql.org/learn/', provider: 'GraphQL Foundation', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'How to GraphQL', type: 'course', url: 'https://www.howtographql.com/', provider: 'Prisma', duration: '10 hours', difficulty: 'intermediate', cost: 0, tags: ['free', 'fullstack'] },
    ],
    typicalLevels: {
      beginner: 'Schema, queries, mutations, resolvers',
      intermediate: 'Subscriptions, federation, caching, N+1',
      advanced: 'Schema stitching, custom directives, performance',
      expert: 'Specification, execution engine, tooling',
    },
  },
  'Tailwind CSS': {
    name: 'Tailwind CSS',
    category: 'Frontend',
    relatedSkills: ['CSS', 'React', 'Next.js', 'Design Systems'],
    prerequisites: ['CSS Basics'],
    learningResources: [
      { title: 'Tailwind CSS Documentation', type: 'documentation', url: 'https://tailwindcss.com/docs', provider: 'Tailwind Labs', duration: '3 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Tailwind CSS From Scratch', type: 'course', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gpXORlEHjc5bgnKd5pS8yP', provider: 'Traversy Media', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['free', 'video'] },
    ],
    typicalLevels: {
      beginner: 'Utility classes, configuration, responsive design',
      intermediate: 'Custom theme, plugins, JIT mode, dark mode',
      advanced: 'Custom plugins, design system, component library',
      expert: 'Core contributions, plugin ecosystem, performance',
    },
  },
  'Machine Learning': {
    name: 'Machine Learning',
    category: 'AI/ML',
    relatedSkills: ['Python', 'PyTorch', 'TensorFlow', 'Data Science', 'Statistics'],
    prerequisites: ['Python', 'Linear Algebra', 'Statistics'],
    learningResources: [
      { title: 'Machine Learning Crash Course', type: 'course', url: 'https://developers.google.com/machine-learning/crash-course', provider: 'Google', duration: '15 hours', difficulty: 'beginner', cost: 0, tags: ['free', 'google'] },
      { title: 'Fast.ai Practical Deep Learning', type: 'course', url: 'https://course.fast.ai/', provider: 'Fast.ai', duration: '40 hours', difficulty: 'intermediate', cost: 0, tags: ['free', 'practical'] },
      { title: 'Hands-On ML with Scikit-Learn, Keras & TensorFlow', type: 'book', url: 'https://github.com/ageron/handson-ml2', provider: 'Aurélien Géron', duration: '30 hours', difficulty: 'intermediate', cost: 50, tags: ['comprehensive'] },
    ],
    typicalLevels: {
      beginner: 'Supervised/unsupervised learning, basic algorithms, evaluation',
      intermediate: 'Neural networks, CNNs, RNNs, transfer learning',
      advanced: 'Transformers, RL, MLOps, model deployment, optimization',
      expert: 'Research, novel architectures, distributed training, novel applications',
    },
  },
  // Add more skills from the portfolio
  'FastAPI': {
    name: 'FastAPI',
    category: 'Backend',
    relatedSkills: ['Python', 'PostgreSQL', 'Pydantic', 'SQLAlchemy'],
    prerequisites: ['Python', 'REST APIs'],
    learningResources: [
      { title: 'FastAPI Documentation', type: 'documentation', url: 'https://fastapi.tiangolo.com/', provider: 'Sebastián Ramírez', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'FastAPI Tutorial', type: 'course', url: 'https://fastapi.tiangolo.com/tutorial/', provider: 'FastAPI', duration: '6 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
    ],
    typicalLevels: {
      beginner: 'Routing, dependency injection, Pydantic models',
      intermediate: 'Async, WebSockets, background tasks, testing',
      advanced: 'Custom middleware, OpenAPI extensions, performance',
      expert: 'Internals, Starlette integration, custom routing',
    },
  },
  'Git': {
    name: 'Git',
    category: 'DevOps',
    relatedSkills: ['GitHub', 'CI/CD', 'Code Review'],
    prerequisites: [],
    learningResources: [
      { title: 'Git Documentation', type: 'documentation', url: 'https://git-scm.com/doc', provider: 'Git', duration: '3 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'Pro Git Book', type: 'book', url: 'https://git-scm.com/book/en/v2', provider: 'Scott Chacon & Ben Straub', duration: '8 hours', difficulty: 'beginner', cost: 0, tags: ['free', 'comprehensive'] },
    ],
    typicalLevels: {
      beginner: 'Clone, add, commit, push, pull, branch, merge',
      intermediate: 'Rebase, cherry-pick, bisect, worktrees, submodules',
      advanced: 'Hooks, filtering history, internals, custom commands',
      expert: 'Internals, custom transport, protocol extensions',
    },
  },
  'Linux': {
    name: 'Linux',
    category: 'DevOps',
    relatedSkills: ['Docker', 'Kubernetes', 'Shell Scripting', 'Networking'],
    prerequisites: [],
    learningResources: [
      { title: 'Linux Journey', type: 'course', url: 'https://linuxjourney.com/', provider: 'Community', duration: '6 hours', difficulty: 'beginner', cost: 0, tags: ['free', 'interactive'] },
      { title: 'The Linux Command Line', type: 'book', url: 'http://linuxcommand.org/tlcl.php', provider: 'William Shotts', duration: '12 hours', difficulty: 'beginner', cost: 0, tags: ['free', 'comprehensive'] },
    ],
    typicalLevels: {
      beginner: 'File system, permissions, package management, basic commands',
      intermediate: 'Shell scripting, process management, systemd, cron',
      advanced: 'Kernel modules, performance tuning, security hardening',
      expert: 'Kernel development, driver writing, embedded systems',
    },
  },
  'CI/CD': {
    name: 'CI/CD',
    category: 'DevOps',
    relatedSkills: ['Git', 'Docker', 'GitHub Actions', 'Testing'],
    prerequisites: ['Git', 'Docker Basics'],
    learningResources: [
      { title: 'GitHub Actions Documentation', type: 'documentation', url: 'https://docs.github.com/en/actions', provider: 'GitHub', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: 'CI/CD with GitHub Actions', type: 'course', url: 'https://github.com/skills/ci-cd', provider: 'GitHub', duration: '3 hours', difficulty: 'beginner', cost: 0, tags: ['free', 'hands-on'] },
    ],
    typicalLevels: {
      beginner: 'Workflows, jobs, steps, caching, artifacts',
      intermediate: 'Matrix builds, environments, secrets, reusable workflows',
      advanced: 'Self-hosted runners, custom actions, security scanning',
      expert: 'Custom runners, enterprise features, migration strategies',
    },
  },
  'REST APIs': {
    name: 'REST APIs',
    category: 'API',
    relatedSkills: ['HTTP', 'JSON', 'OpenAPI', 'Authentication'],
    prerequisites: ['HTTP Basics'],
    learningResources: [
      { title: 'REST API Tutorial', type: 'course', url: 'https://restfulapi.net/', provider: 'Community', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['free'] },
      { title: 'Designing RESTful APIs', type: 'book', url: 'https://www.apigee.com/about/resources/ebooks/designing-restful-apis', provider: 'Apigee', duration: '6 hours', difficulty: 'intermediate', cost: 0, tags: ['free', 'design'] },
    ],
    typicalLevels: {
      beginner: 'HTTP methods, status codes, JSON, basic CRUD',
      intermediate: 'Versioning, pagination, filtering, rate limiting',
      advanced: 'HATEOAS, hypermedia, GraphQL comparison, versioning strategies',
      expert: 'API governance, standards, ecosystem design',
    },
  },
};

// ============================================================
// Skill Gap Analysis Engine
// ============================================================

export class SkillGapAnalyzer {
  private skillDb: Record<string, SkillInfo>;

  constructor(skillDb: Record<string, SkillInfo> = SKILL_DATABASE) {
    this.skillDb = skillDb;
  }

  /**
   * Analyze skill gaps between user profile and target job/project
   */
  analyze(
    userProfile: UserProfile,
    target: JobProfile | Project
  ): SkillGapAnalysisResult {
    // Extract requirements from target
    const requirements = this.extractRequirements(target);

    // Calculate gaps for each requirement
    const gaps: SkillGap[] = [];
    const strengths: SkillGap[] = [];

    for (const req of requirements) {
      const userSkill = userProfile.skills.find(s =>
        s.name.toLowerCase() === req.skill.toLowerCase()
      );

      const currentLevel = userSkill?.proficiency || 0;
      const gap = req.requiredLevel - currentLevel;

      const skillGap: SkillGap = {
        skill: req.skill,
        category: req.category,
        currentLevel,
        requiredLevel: req.requiredLevel,
        gap,
        importance: req.importance,
        priority: this.calculatePriority(gap, req.importance, req.weight),
        recommendation: this.generateRecommendation(req.skill, req.category, gap, req.importance),
      };

      if (gap > 0) {
        gaps.push(skillGap);
      } else if (gap < 0) {
        strengths.push({ ...skillGap, gap: Math.abs(gap) });
      }
    }

    // Sort gaps by priority
    gaps.sort((a, b) => b.priority - a.priority);

    // Generate learning path
    const learningPath = this.generateLearningPath(userProfile, gaps);

    // Calculate overall match
    const overallMatch = this.calculateOverallMatch(requirements, userProfile);

    // Generate summary
    const summary = this.generateSummary(gaps, strengths, overallMatch);

    return {
      userProfile,
      targetProfile: target,
      overallMatch,
      gaps,
      strengths,
      learningPath,
      summary,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Extract skill requirements from job profile or project
   */
  private extractRequirements(target: JobProfile | Project): JobRequirement[] {
    if ('requirements' in target) {
      // JobProfile
      return target.requirements;
    } else {
      // Project - infer requirements from tech stack and category
      return this.inferRequirementsFromProject(target);
    }
  }

  /**
   * Infer requirements from project data
   */
  private inferRequirementsFromProject(project: Project): JobRequirement[] {
    const requirements: JobRequirement[] = [];

    // Tech stack skills
    for (const tech of project.tech) {
      const skillInfo = this.skillDb[tech];
      const category = skillInfo?.category || 'General';
      const baseLevel = this.getProjectSkillLevel(project, tech);

      requirements.push({
        skill: tech,
        category,
        requiredLevel: baseLevel,
        importance: 'important',
        weight: 0.8,
      });
    }

    // Category-specific skills
    const categorySkills = this.getCategorySkills(project.category);
    for (const skill of categorySkills) {
      if (!project.tech.includes(skill)) {
        requirements.push({
          skill,
          category: 'General',
          requiredLevel: 3,
          importance: 'nice-to-have',
          weight: 0.4,
        });
      }
    }

    // Soft skills for solo projects
    if (project.role?.toLowerCase().includes('solo')) {
      requirements.push(
        { skill: 'Project Management', category: 'Soft Skills', requiredLevel: 3, importance: 'important', weight: 0.6 },
        { skill: 'Communication', category: 'Soft Skills', requiredLevel: 3, importance: 'important', weight: 0.6 },
        { skill: 'Time Management', category: 'Soft Skills', requiredLevel: 4, importance: 'critical', weight: 0.7 },
      );
    }

    return requirements;
  }

  private getProjectSkillLevel(project: Project, tech: string): number {
    // Infer required level based on project complexity
    const complexityMap: Record<string, number> = {
      'Web Development': 3,
      'Mobile Development': 3,
      'Applications': 4,
      'AI/ML': 4,
      'DevOps': 3,
    };
    return complexityMap[project.category] || 3;
  }

  private getCategorySkills(category: string): string[] {
    const categorySkills: Record<string, string[]> = {
      'Web Development': ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'CI/CD', 'REST APIs', 'Tailwind CSS'],
      'Mobile Development': ['React Native', 'TypeScript', 'Git', 'CI/CD', 'REST APIs'],
      'Applications': ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes', 'CI/CD', 'GraphQL'],
      'AI/ML': ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'Data Science', 'Statistics', 'Docker', 'AWS'],
      'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Linux', 'CI/CD', 'Monitoring', 'Linux'],
    };
    return categorySkills[category] || [];
  }

  /**
   * Calculate priority score for a skill gap
   */
  private calculatePriority(gap: number, importance: JobRequirement['importance'], weight: number): number {
    if (gap <= 0) return 0;

    const importanceWeight = {
      critical: 1.0,
      important: 0.7,
      'nice-to-have': 0.3,
    }[importance];

    // Priority = gap * importance * weight * 10 (scale to 0-100)
    return Math.min(100, Math.round(gap * importanceWeight * weight * 10));
  }

  /**
   * Generate learning recommendation for a skill gap
   */
  private generateRecommendation(skill: string, category: string, gap: number, importance: JobRequirement['importance']): LearningRecommendation {
    const skillInfo = this.skillDb[skill];
    const estimatedHours = this.estimateLearningHours(gap, skillInfo);

    return {
      skill,
      priority: gap >= 3 ? 'high' : gap >= 2 ? 'medium' : 'low',
      estimatedHours,
      resources: skillInfo?.learningResources || this.getGenericResources(skill, category),
      milestones: this.generateMilestones(skill, gap, skillInfo),
      prerequisites: skillInfo?.prerequisites || [],
    };
  }

  private estimateLearningHours(gap: number, skillInfo?: SkillInfo): number {
    // Base hours per level gap
    const baseHoursPerLevel = 20;
    const difficultyMultiplier = skillInfo?.typicalLevels ? 1.5 : 1;
    return Math.round(gap * baseHoursPerLevel * difficultyMultiplier);
  }

  private getGenericResources(skill: string, category: string): LearningResource[] {
    return [
      {
        title: `${skill} Documentation`,
        type: 'documentation',
        url: `https://github.com/search?q=${encodeURIComponent(skill)}+documentation`,
        provider: 'Official',
        duration: '4 hours',
        difficulty: 'beginner',
        cost: 0,
        tags: ['official', 'free'],
      },
      {
        title: `${skill} Tutorial`,
        type: 'course',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`,
        provider: 'YouTube',
        duration: '4 hours',
        difficulty: 'beginner',
        cost: 0,
        tags: ['free', 'video'],
      },
    ];
  }

  private generateMilestones(skill: string, gap: number, skillInfo?: SkillInfo): Milestone[] {
    const milestones: Milestone[] = [];
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

    for (let i = 0; i < gap; i++) {
      const fromLevel = levels[i] || 'intermediate';
      const toLevel = levels[i + 1] || 'advanced';

      milestones.push({
        title: `${skill}: ${fromLevel} → ${toLevel}`,
        description: `Progress from ${fromLevel} to ${toLevel} level in ${skill}`,
        estimatedHours: 20,
        skillsGained: [`${skill} (${toLevel})`],
        verification: `Complete a project demonstrating ${toLevel} ${skill} skills`,
      });
    }

    return milestones;
  }

  /**
   * Generate learning path from gaps
   */
  private generateLearningPath(userProfile: UserProfile, gaps: SkillGap[]): LearningPath {
    // Sort gaps by priority and group into phases
    const highPriority = gaps.filter(g => g.priority >= 70);
    const mediumPriority = gaps.filter(g => g.priority >= 40 && g.priority < 70);
    const lowPriority = gaps.filter(g => g.priority < 40);

    const phases: LearningPhase[] = [
      {
        name: 'Foundation',
        description: 'Critical skills needed immediately',
        skills: highPriority.map(g => g.skill),
        estimatedHours: highPriority.reduce((sum, g) => sum + g.recommendation.estimatedHours, 0),
        resources: highPriority.flatMap(g => g.recommendation.resources),
        prerequisites: highPriority.flatMap(g => g.recommendation.prerequisites),
        order: 1,
      },
      {
        name: 'Core Competencies',
        description: 'Important skills for target role',
        skills: mediumPriority.map(g => g.skill),
        estimatedHours: mediumPriority.reduce((sum, g) => sum + g.recommendation.estimatedHours, 0),
        resources: mediumPriority.flatMap(g => g.recommendation.resources),
        prerequisites: mediumPriority.flatMap(g => g.recommendation.prerequisites),
        order: 2,
      },
      {
        name: 'Enhancement',
        description: 'Nice-to-have skills for differentiation',
        skills: lowPriority.map(g => g.skill),
        estimatedHours: lowPriority.reduce((sum, g) => sum + g.recommendation.estimatedHours, 0),
        resources: lowPriority.flatMap(g => g.recommendation.resources),
        prerequisites: lowPriority.flatMap(g => g.recommendation.prerequisites),
        order: 3,
      },
    ].filter(p => p.skills.length > 0);

    const totalHours = phases.reduce((sum, p) => sum + p.estimatedHours, 0);
    const weeklyCommitment = userProfile.preferences.timeCommitment || 10;
    const estimatedWeeks = Math.ceil(totalHours / weeklyCommitment);

    return {
      phases,
      totalEstimatedHours: totalHours,
      estimatedWeeks,
      weeklyCommitment,
    };
  }

  /**
   * Calculate overall match percentage
   */
  private calculateOverallMatch(requirements: JobRequirement[], userProfile: UserProfile): number {
    if (requirements.length === 0) return 100;

    let totalScore = 0;
    let maxScore = 0;

    for (const req of requirements) {
      const userSkill = userProfile.skills.find(s =>
        s.name.toLowerCase() === req.skill.toLowerCase()
      );
      const currentLevel = userSkill?.proficiency || 0;
      const skillScore = Math.min(100, (currentLevel / req.requiredLevel) * 100);

      maxScore += req.weight * 100;
      totalScore += skillScore * req.weight;
    }

    return Math.round((totalScore / maxScore) * 100);
  }

  /**
   * Generate summary text
   */
  private generateSummary(gaps: SkillGap[], strengths: SkillGap[], match: number): string {
    const criticalGaps = gaps.filter(g => g.importance === 'critical').length;
    const highPriorityGaps = gaps.filter(g => g.priority >= 70).length;

    return `Overall match: ${match}%. ${gaps.length} skill gaps identified (${criticalGaps} critical, ${highPriorityGaps} high priority). ${strengths.length} strengths identified where you exceed requirements. Estimated ${gaps.reduce((sum, g) => sum + g.recommendation.estimatedHours, 0)} hours to close all gaps.`;
  }
}

// ============================================================
// Export Functions
// ============================================================

export function analyzeSkillGaps(
  userProfile: UserProfile,
  target: JobProfile | Project
): SkillGapAnalysisResult {
  const analyzer = new SkillGapAnalyzer();
  return analyzer.analyze(userProfile, target);
}

export async function generateLearningPlan(
  userProfile: UserProfile,
  target: JobProfile | Project
): Promise<LearningPath> {
  const analysis = analyzeSkillGaps(userProfile, target);
  return analysis.learningPath;
}

// ============================================================
// Resource Recommendation Engine
// ============================================================

export class ResourceRecommender {
  private skillDb: Record<string, SkillInfo>;

  constructor(skillDb: Record<string, SkillInfo> = SKILL_DATABASE) {
    this.skillDb = skillDb;
  }

  /**
   * Get personalized resource recommendations for a skill
   */
  recommendResources(
    skill: string,
    userProfile: UserProfile,
    targetLevel: number
  ): LearningResource[] {
    const skillInfo = this.skillDb[skill];
    if (!skillInfo) return this.getGenericResources(skill, 'General');

    const userPref = userProfile.preferences;
    const currentSkill = userProfile.skills.find(s => s.name.toLowerCase() === skill.toLowerCase());
    const currentLevel = currentSkill?.proficiency || 0;

    // Filter resources based on user preferences
    let resources = skillInfo.learningResources.filter(r => {
      // Match learning style
      if (userPref.preferredResources.length > 0 && !userPref.preferredResources.includes(r.type)) {
        return false;
      }
      // Match budget
      if (r.cost > userPref.budget) {
        return false;
      }
      // Match difficulty to target level
      const levelMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 } as const;
      const reverseLevelMap = { 1: 'beginner', 2: 'intermediate', 3: 'advanced', 4: 'expert' } as const;
      const targetLevelNum = levelMap[reverseLevelMap[targetLevel as keyof typeof reverseLevelMap] as keyof typeof levelMap] || 2;
      const resourceLevelNum = levelMap[r.difficulty];
      return resourceLevelNum >= targetLevelNum - 1 && resourceLevelNum <= targetLevelNum + 1;
    });

    // Sort by relevance (rating, cost, user preference match)
    resources.sort((a, b) => {
      const aScore = (a.rating || 0) * 2 - (a.cost / 10) + (userPref.preferredResources.includes(a.type) ? 5 : 0);
      const bScore = (b.rating || 0) * 2 - (b.cost / 10) + (userPref.preferredResources.includes(b.type) ? 5 : 0);
      return bScore - aScore;
    });

    return resources.slice(0, 5); // Top 5 recommendations
  }

  private getGenericResources(skill: string, category: string): LearningResource[] {
    return [
      { title: `${skill} Official Documentation`, type: 'documentation', url: `https://github.com/search?q=${encodeURIComponent(skill)}+documentation`, provider: 'Official', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['official', 'free'] },
      { title: `${skill} Tutorial - YouTube`, type: 'video', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`, provider: 'YouTube', duration: '4 hours', difficulty: 'beginner', cost: 0, tags: ['free', 'video'] },
    ];
  }
}

export function recommendResources(skill: string, userProfile: UserProfile, targetLevel: number): LearningResource[] {
  const recommender = new ResourceRecommender();
  return recommender.recommendResources(skill, userProfile, targetLevel);
}

// ============================================================
// Export
// ============================================================

// All types, classes, and constants are already exported at their definitions
// No explicit re-exports needed