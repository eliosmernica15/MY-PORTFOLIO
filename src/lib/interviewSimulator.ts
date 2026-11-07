/**
 * Interview Simulator
 *
 * AI-powered interview practice system that simulates technical interviews
 * based on user's portfolio projects, skills, and target roles.
 *
 * Features:
 * - Role-specific question generation (behavioral, technical, system design)
 * - Portfolio-aware questions based on user's projects
 * - Real-time feedback and scoring
 * - Multiple interview modes (screening, technical, system design, behavioral)
 * - Progress tracking and improvement analytics
 * - Export interview sessions for review
 */

import { PROJECTS } from '@/data/projects';
import { SKILL_CATEGORIES } from '@/data/skills';
import type { Project, Skill } from '@/types';

// ============================================================
// Types
// ============================================================

export interface InterviewSession {
  id: string;
  userId: string;
  mode: InterviewMode;
  targetRole: string;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  score: InterviewScore;
  feedback: InterviewFeedback;
  startedAt: string;
  completedAt?: string;
  duration: number; // seconds
}

export type InterviewMode = 'screening' | 'technical' | 'system-design' | 'behavioral' | 'mixed';

export interface InterviewQuestion {
  id: string;
  type: QuestionType;
  category: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedDuration: number; // seconds
  tags: string[];
  expectedKeywords: string[];
  followUps: string[];
  projectContext?: string;
}

export type QuestionType = 'technical' | 'behavioral' | 'system-design' | 'coding' | 'debugging' | 'architecture' | 'tradeoffs';

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  duration: number; // seconds
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  improvements: string[];
  keywordsCovered: string[];
  keywordsMissed: string[];
}

export interface InterviewScore {
  overall: number; // 0-100
  technical: number;
  behavioral: number;
  communication: number;
  problemSolving: number;
  breakdown: Record<string, number>;
}

export interface InterviewFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  actionItems: ActionItem[];
  recommendedResources: string[];
  nextSteps: string[];
}

export interface ActionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  category: string;
}

// ============================================================
// Question Bank
// ============================================================

const QUESTION_BANK: Record<string, InterviewQuestion[]> = {
  // Technical questions by category
  'React': [
    {
      id: 'react-hooks',
      type: 'technical',
      category: 'React',
      question: 'Explain the difference between useState and useReducer. When would you choose one over the other?',
      difficulty: 'medium',
      expectedDuration: 120,
      tags: ['hooks', 'state-management'],
      expectedKeywords: ['useState', 'useReducer', 'complex state', 'predictable updates', 'testing'],
      followUps: ['How does useReducer help with testing?', 'What about useContext with useReducer?'],
      projectContext: 'State management in your portfolio projects',
    },
    {
      id: 'react-performance',
      type: 'technical',
      category: 'React',
      question: 'How do you optimize React component performance? Walk me through your approach.',
      difficulty: 'medium',
      expectedDuration: 180,
      tags: ['performance', 'optimization', 'memo', 'useMemo', 'useCallback'],
      expectedKeywords: ['React.memo', 'useMemo', 'useCallback', 'virtualization', 'code splitting', 'lazy loading'],
      followUps: ['When does memoization hurt performance?', 'How do you measure component performance?'],
    },
    {
      id: 'react-server-components',
      type: 'technical',
      category: 'React',
      question: 'What are React Server Components and how do they differ from client components? What are the trade-offs?',
      difficulty: 'hard',
      expectedDuration: 240,
      tags: ['server-components', 'nextjs', 'rendering'],
      expectedKeywords: ['server components', 'client components', 'serialization', 'bundle size', 'streaming'],
      followUps: ['When would you NOT use server components?', 'How do they affect caching?'],
    },
  ],
  'TypeScript': [
    {
      id: 'ts-generics',
      type: 'technical',
      category: 'TypeScript',
      question: 'Explain TypeScript generics with a practical example. When do you use constraints?',
      difficulty: 'medium',
      expectedDuration: 120,
      tags: ['generics', 'constraints', 'type-safety'],
      expectedKeywords: ['generics', 'constraints', 'extends', 'type inference', 'reusability'],
      followUps: ['What are conditional types?', 'How do you handle default type parameters?'],
    },
    {
      id: 'ts-advanced-types',
      type: 'technical',
      category: 'TypeScript',
      question: 'Explain the difference between interface and type. When would you use each?',
      difficulty: 'easy',
      expectedDuration: 90,
      tags: ['interface', 'type', 'declaration-merging'],
      expectedKeywords: ['interface', 'type', 'declaration merging', 'extends', 'union', 'intersection'],
      followUps: ['Can you merge types?', 'What about type aliases for primitives?'],
    },
  ],
  'Node.js': [
    {
      id: 'node-event-loop',
      type: 'technical',
      category: 'Node.js',
      question: 'Explain the Node.js event loop. How do microtasks and macrotasks work?',
      difficulty: 'medium',
      expectedDuration: 150,
      tags: ['event-loop', 'async', 'microtasks', 'macrotasks'],
      expectedKeywords: ['event loop', 'microtasks', 'macrotasks', 'process.nextTick', 'setImmediate', 'promises'],
      followUps: ['How does this affect async/await?', 'What about worker threads?'],
    },
    {
      id: 'node-streams',
      type: 'technical',
      category: 'Node.js',
      question: 'Explain Node.js streams. When would you use a transform stream vs a duplex stream?',
      difficulty: 'hard',
      expectedDuration: 180,
      tags: ['streams', 'transform', 'duplex', 'backpressure'],
      expectedKeywords: ['readable', 'writable', 'transform', 'duplex', 'pipeline', 'backpressure'],
      followUps: ['How do you handle backpressure?', 'What about object mode?'],
    },
  ],
  'System Design': [
    {
      id: 'design-url-shortener',
      type: 'system-design',
      category: 'System Design',
      question: 'Design a URL shortener like bit.ly. Consider scale, analytics, and custom aliases.',
      difficulty: 'medium',
      expectedDuration: 600,
      tags: ['scalability', 'database', 'caching', 'consistent-hashing'],
      expectedKeywords: ['consistent hashing', 'database sharding', 'redis', 'cache', 'analytics', 'rate limiting'],
      followUps: ['How do you handle collision?', 'What about custom domains?', 'How do you scale analytics?'],
    },
    {
      id: 'design-chat-app',
      type: 'system-design',
      category: 'System Design',
      question: 'Design a real-time chat application like WhatsApp. Support 1M concurrent users.',
      difficulty: 'hard',
      expectedDuration: 900,
      tags: ['websockets', 'message-queue', 'presence', 'scalability'],
      expectedKeywords: ['websockets', 'message queue', 'redis pub/sub', 'horizontal scaling', 'message ordering', 'offline support'],
      followUps: ['How do you handle message delivery guarantees?', 'What about group chats?', 'How do you handle media?'],
    },
    {
      id: 'design-rate-limiter',
      type: 'system-design',
      category: 'System Design',
      question: 'Design a distributed rate limiter. Support multiple algorithms (token bucket, sliding window).',
      difficulty: 'medium',
      expectedDuration: 450,
      tags: ['rate-limiting', 'distributed-systems', 'redis', 'algorithms'],
      expectedKeywords: ['token bucket', 'sliding window', 'fixed window', 'distributed', 'redis', 'lua scripts'],
      followUps: ['How do you handle clock drift?', 'What about multi-region?'],
    },
  ],
  'Behavioral': [
    {
      id: 'behavioral-challenge',
      type: 'behavioral',
      category: 'Behavioral',
      question: 'Tell me about a time you faced a significant technical challenge. How did you approach it?',
      difficulty: 'easy',
      expectedDuration: 180,
      tags: ['problem-solving', 'communication', 'star-method'],
      expectedKeywords: ['situation', 'task', 'action', 'result', 'learning', 'collaboration'],
      followUps: ['What would you do differently?', 'How did you communicate with stakeholders?'],
    },
    {
      id: 'behavioral-conflict',
      type: 'behavioral',
      category: 'Behavioral',
      question: 'Describe a situation where you disagreed with a team member or stakeholder. How did you handle it?',
      difficulty: 'easy',
      expectedDuration: 180,
      tags: ['conflict-resolution', 'communication', 'teamwork'],
      expectedKeywords: ['listening', 'data-driven', 'compromise', 'escalation', 'relationship'],
      followUps: ['What was the outcome?', 'How did it affect your relationship?'],
    },
    {
      id: 'behavioral-failure',
      type: 'behavioral',
      category: 'Behavioral',
      question: 'Tell me about a project that failed or didn\'t meet expectations. What did you learn?',
      difficulty: 'medium',
      expectedDuration: 180,
      tags: ['failure', 'learning', 'accountability', 'growth'],
      expectedKeywords: ['ownership', 'root cause', 'process improvement', 'sharing learnings'],
      followUps: ['How did you communicate the failure?', 'What processes changed?'],
    },
  ],
  'Trading/FinTech': [
    {
      id: 'trading-order-book',
      type: 'technical',
      category: 'Trading/FinTech',
      question: 'Design an order book matching engine. How do you handle price-time priority?',
      difficulty: 'hard',
      expectedDuration: 300,
      tags: ['order-book', 'matching-engine', 'latency', 'concurrency'],
      expectedKeywords: ['price-time priority', 'limit orders', 'market orders', 'matching algorithm', 'lock-free'],
      followUps: ['How do you handle partial fills?', 'What about self-trade prevention?'],
    },
    {
      id: 'trading-risk',
      type: 'technical',
      category: 'Trading/FinTech',
      question: 'How would you implement real-time risk management for a trading system?',
      difficulty: 'hard',
      expectedDuration: 300,
      tags: ['risk-management', 'real-time', 'position-limits', 'var'],
      expectedKeywords: ['position limits', 'VaR', 'greeks', 'margin', 'real-time monitoring', 'alerts'],
      followUps: ['How do you handle latency?', 'What about regulatory reporting?'],
    },
  ],
};

// ============================================================
// Interview Simulator Engine
// ============================================================

export class InterviewSimulator {
  private questionBank: Record<string, InterviewQuestion[]>;

  constructor(customBank?: Record<string, InterviewQuestion[]>) {
    this.questionBank = { ...QUESTION_BANK, ...customBank };
  }

  /**
   * Generate interview session based on user profile and target role
   */
  async generateSession(
    userId: string,
    mode: InterviewMode,
    targetRole: string,
    userProjects: Project[],
    userSkills: string[]
  ): Promise<InterviewSession> {
    const questions = this.selectQuestions(mode, targetRole, userProjects, userSkills);

    return {
      id: `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      mode,
      targetRole,
      questions,
      answers: [],
      score: {
        overall: 0,
        technical: 0,
        behavioral: 0,
        communication: 0,
        problemSolving: 0,
        breakdown: {},
      },
      feedback: {
        summary: '',
        strengths: [],
        improvements: [],
        actionItems: [],
        recommendedResources: [],
        nextSteps: [],
      },
      startedAt: new Date().toISOString(),
      duration: 0,
    };
  }

  /**
   * Select questions based on mode, role, projects, and skills
   */
  private selectQuestions(
    mode: InterviewMode,
    targetRole: string,
    userProjects: Project[],
    userSkills: string[]
  ): InterviewQuestion[] {
    const allQuestions = this.getQuestionsForMode(mode);
    const selected: InterviewQuestion[] = [];

    // Add project-specific questions
    for (const project of userProjects.slice(0, 3)) {
      const projectQuestions = this.generateProjectQuestions(project);
      selected.push(...projectQuestions);
    }

    // Add skill-based questions
    for (const skill of userSkills.slice(0, 5)) {
      const skillQuestions = this.getQuestionsForSkill(skill);
      selected.push(...skillQuestions.slice(0, 2));
    }

    // Add role-specific questions
    const roleQuestions = this.getQuestionsForRole(targetRole);
    selected.push(...roleQuestions.slice(0, 3));

    // Add general questions for mode
    const generalQuestions = allQuestions.filter(q =>
      !selected.some(s => s.id === q.id)
    );
    selected.push(...generalQuestions.slice(0, 5));

    // Shuffle and limit
    return this.shuffleArray(selected).slice(0, this.getQuestionCount(mode));
  }

  private getQuestionCount(mode: InterviewMode): number {
    switch (mode) {
      case 'screening': return 5;
      case 'technical': return 8;
      case 'system-design': return 3;
      case 'behavioral': return 5;
      case 'mixed': return 10;
      default: return 8;
    }
  }

  private getQuestionsForMode(mode: InterviewMode): InterviewQuestion[] {
    const questions: InterviewQuestion[] = [];

    for (const [category, questionsList] of Object.entries(this.questionBank)) {
      for (const q of questionsList) {
        if (this.matchesMode(q.type, mode)) {
          questions.push(q);
        }
      }
    }

    return questions;
  }

  private matchesMode(type: QuestionType, mode: InterviewMode): boolean {
    if (mode === 'mixed') return true;
    if (mode === 'technical') return ['technical', 'coding', 'debugging', 'architecture', 'tradeoffs'].includes(type);
    if (mode === 'system-design') return type === 'system-design';
    if (mode === 'behavioral') return type === 'behavioral';
    if (mode === 'screening') return ['technical', 'behavioral'].includes(type);
    return false;
  }

  private getQuestionsForSkill(skill: string): InterviewQuestion[] {
    for (const [category, questions] of Object.entries(this.questionBank)) {
      if (category.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(category.toLowerCase())) {
        return questions;
      }
    }
    return [];
  }

  private getQuestionsForRole(role: string): InterviewQuestion[] {
    const roleSkills = this.getRoleSkills(role);
    const questions: InterviewQuestion[] = [];

    for (const skill of roleSkills) {
      questions.push(...this.getQuestionsForSkill(skill).slice(0, 2));
    }

    return questions;
  }

  private getRoleSkills(role: string): string[] {
    const roleSkills: Record<string, string[]> = {
      'frontend': ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'CSS'],
      'backend': ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs', 'GraphQL'],
      'fullstack': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
      'devops': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Linux', 'CI/CD', 'Monitoring'],
      'mobile': ['React Native', 'TypeScript', 'Git', 'CI/CD'],
      'ai/ml': ['Python', 'Machine Learning', 'PyTorch', 'Data Science'],
      'trading': ['Python', 'Trading/FinTech', 'Python', 'PostgreSQL', 'Redis'],
      'frontend-engineer': ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'CSS', 'Testing'],
      'backend-engineer': ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs', 'GraphQL', 'System Design'],
      'software-engineer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'System Design', 'Testing'],
    };

    return roleSkills[role.toLowerCase()] || ['React', 'TypeScript', 'Node.js', 'System Design'];
  }

  private generateProjectQuestions(project: Project): InterviewQuestion[] {
    return [
      {
        id: `project-${project.id}-1`,
        type: 'technical',
        category: project.category,
        question: `Walk me through the architecture of ${project.title}. What were the key technical decisions?`,
        difficulty: 'medium',
        expectedDuration: 180,
        tags: ['architecture', 'decision-making', project.category],
        expectedKeywords: ['architecture', 'trade-offs', 'scalability', 'tech stack', project.tech.join(', ')],
        followUps: [
          'What would you change if you rebuilt it?',
          'How did you handle scaling?',
          'What was the hardest technical challenge?',
        ],
        projectContext: project.title,
      },
      {
        id: `project-${project.id}-2`,
        type: 'behavioral',
        category: project.category,
        question: `Tell me about a specific challenge you faced while building ${project.title}. How did you solve it?`,
        difficulty: 'medium',
        expectedDuration: 150,
        tags: ['problem-solving', 'project-specific', project.category],
        expectedKeywords: ['challenge', 'solution', 'debugging', 'learning', project.challenge || ''],
        followUps: [
          'What would you do differently?',
          'How did this affect the timeline?',
        ],
        projectContext: project.title,
      },
      {
        id: `project-${project.id}-3`,
        type: 'technical',
        category: project.category,
        question: `The project uses ${project.tech.slice(0, 3).join(', ')}. Why did you choose this stack? What are the trade-offs?`,
        difficulty: 'medium',
        expectedDuration: 120,
        tags: ['tech-stack', 'decision-making', 'tradeoffs'],
        expectedKeywords: project.tech.slice(0, 5),
        followUps: [
          'Would you choose the same stack today?',
          'What about performance?',
        ],
        projectContext: project.title,
      },
    ];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Evaluate an answer and provide feedback
   */
  async evaluateAnswer(
    session: InterviewSession,
    questionId: string,
    answer: string,
    duration: number
  ): Promise<InterviewAnswer> {
    const question = session.questions.find(q => q.id === questionId);
    if (!question) throw new Error('Question not found');

    // Analyze answer
    const evaluation = this.evaluateAnswerContent(question, answer);

    const interviewAnswer: InterviewAnswer = {
      questionId,
      answer,
      duration,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      keywordsCovered: evaluation.keywordsCovered,
      keywordsMissed: evaluation.keywordsMissed,
    };

    return interviewAnswer;
  }

  /**
   * Evaluate answer content using keyword matching and heuristics
   */
  private evaluateAnswerContent(
    question: InterviewQuestion,
    answer: string
  ): {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    keywordsCovered: string[];
    keywordsMissed: string[];
  } {
    const answerLower = answer.toLowerCase();
    const keywordsCovered: string[] = [];
    const keywordsMissed: string[] = [];

    for (const keyword of question.expectedKeywords) {
      if (answerLower.includes(keyword.toLowerCase())) {
        keywordsCovered.push(keyword);
      } else {
        keywordsMissed.push(keyword);
      }
    }

    // Calculate score based on keyword coverage and answer quality
    const coverage = question.expectedKeywords.length > 0
      ? keywordsCovered.length / question.expectedKeywords.length
      : 0;

    const lengthScore = Math.min(1, answer.length / 500); // Expect ~500 chars for good answer
    const structureScore = this.evaluateStructure(answer);

    const score = Math.round((coverage * 0.5 + lengthScore * 0.2 + structureScore * 0.3) * 100);

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (keywordsCovered.length > 0) {
      strengths.push(`Covered key concepts: ${keywordsCovered.slice(0, 3).join(', ')}`);
    }
    if (answer.length > 300) {
      strengths.push('Provided detailed explanation');
    }
    if (this.hasStructure(answer)) {
      strengths.push('Well-structured response');
    }

    if (keywordsMissed.length > 0) {
      improvements.push(`Missed key concepts: ${keywordsMissed.slice(0, 3).join(', ')}`);
    }
    if (answer.length < 100) {
      improvements.push('Answer could be more detailed');
    }
    if (!this.hasStructure(answer)) {
      improvements.push('Consider structuring with clear points');
    }

    const feedback = this.generateFeedback(score, strengths, improvements);

    return { score, feedback, strengths, improvements, keywordsCovered, keywordsMissed };
  }

  private evaluateStructure(answer: string): number {
    // Check for structured response indicators
    let score = 0;
    if (answer.includes('First') || answer.includes('First,') || answer.match(/^\d+\./m)) score += 0.3;
    if (answer.includes('Second') || answer.includes('Then') || answer.includes('Next')) score += 0.3;
    if (answer.includes('Finally') || answer.includes('In conclusion') || answer.includes('To summarize')) score += 0.2;
    if (answer.includes('Example') || answer.includes('For instance') || answer.includes('e.g.')) score += 0.2;
    return Math.min(1, score);
  }

  private hasStructure(answer: string): boolean {
    return this.evaluateStructure(answer) > 0.3;
  }

  private generateFeedback(score: number, strengths: string[], improvements: string[]): string {
    let feedback = `Score: ${score}/100\n\n`;

    if (strengths.length > 0) {
      feedback += `Strengths:\n${strengths.map(s => `• ${s}`).join('\n')}\n\n`;
    }

    if (improvements.length > 0) {
      feedback += `Areas for improvement:\n${improvements.map(i => `• ${i}`).join('\n')}\n\n`;
    }

    if (score >= 80) {
      feedback += 'Excellent response! You demonstrated strong understanding.';
    } else if (score >= 60) {
      feedback += 'Good response with room for improvement.';
    } else {
      feedback += 'Consider reviewing the key concepts and practicing more detailed explanations.';
    }

    return feedback;
  }

  /**
   * Complete interview and generate final feedback
   */
  async completeSession(session: InterviewSession): Promise<InterviewSession> {
    const completedSession = { ...session };
    completedSession.completedAt = new Date().toISOString();
    completedSession.duration = Math.floor(
      (new Date(completedSession.completedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
    );

    // Calculate scores
    completedSession.score = this.calculateScores(session);
    completedSession.feedback = this.generateFinalFeedback(session);

    return completedSession;
  }

  private calculateScores(session: InterviewSession): InterviewScore {
    if (session.answers.length === 0) {
      return {
        overall: 0,
        technical: 0,
        behavioral: 0,
        communication: 0,
        problemSolving: 0,
        breakdown: {},
      };
    }

    const technicalAnswers = session.answers.filter(a => {
      const q = session.questions.find(q => q.id === a.questionId);
      return q && ['technical', 'coding', 'debugging', 'architecture', 'tradeoffs', 'system-design'].includes(q.type);
    });

    const behavioralAnswers = session.answers.filter(a => {
      const q = session.questions.find(q => q.id === a.questionId);
      return q && q.type === 'behavioral';
    });

    const technicalScore = technicalAnswers.length > 0
      ? technicalAnswers.reduce((sum, a) => sum + a.score, 0) / technicalAnswers.length
      : 0;

    const behavioralScore = behavioralAnswers.length > 0
      ? behavioralAnswers.reduce((sum, a) => sum + a.score, 0) / behavioralAnswers.length
      : 0;

    // Communication score based on structure and detail
    const communicationScore = session.answers.reduce((sum, a) => sum + a.score, 0) / session.answers.length;

    // Problem solving based on technical answers
    const problemSolvingScore = technicalScore;

    const overall = Math.round(
      technicalScore * 0.4 + behavioralScore * 0.3 + communicationScore * 0.3
    );

    const breakdown: Record<string, number> = {};
    for (const answer of session.answers) {
      const q = session.questions.find(q => q.id === answer.questionId);
      if (q) {
        breakdown[q.category] = (breakdown[q.category] || 0) + answer.score;
      }
    }
    for (const cat of Object.keys(breakdown)) {
      const catAnswers = session.answers.filter(a => {
        const q = session.questions.find(q => q.id === a.questionId);
        return q && q.category === cat;
      });
      breakdown[cat] = Math.round(catAnswers.reduce((s, a) => s + a.score, 0) / catAnswers.length);
    }

    return {
      overall: Math.round(overall),
      technical: Math.round(technicalScore),
      behavioral: Math.round(behavioralScore),
      communication: Math.round(communicationScore),
      problemSolving: Math.round(problemSolvingScore),
      breakdown,
    };
  }

  private generateFinalFeedback(session: InterviewSession): InterviewFeedback {
    const { score, answers, questions } = session;

    const strengths: string[] = [];
    const improvements: string[] = [];

    // Collect all strengths and improvements
    for (const answer of answers) {
      strengths.push(...answer.strengths);
      improvements.push(...answer.improvements);
    }

    // Deduplicate
    const uniqueStrengths = [...new Set(strengths)].slice(0, 5);
    const uniqueImprovements = [...new Set(improvements)].slice(0, 5);

    // Generate action items
    const actionItems: ActionItem[] = uniqueImprovements.slice(0, 3).map((imp, i) => ({
      title: `Improve: ${imp.split(':')[0]}`,
      description: imp,
      priority: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
      estimatedTime: '2-4 hours',
      category: 'Interview Preparation',
    }));

    // Generate recommended resources
    const categories = [...new Set(questions.map(q => q.category))];
    const recommendedResources = categories.map(cat => `Review ${cat} fundamentals and practice related questions`);

    // Generate next steps
    const nextSteps = [
      'Review missed keywords from each question',
      'Practice explaining concepts out loud',
      'Record yourself answering and review',
      'Focus on STAR method for behavioral questions',
    ];

    return {
      summary: `Overall score: ${score.overall}/100. Technical: ${score.technical}, Behavioral: ${score.behavioral}, Communication: ${score.communication}.`,
      strengths: uniqueStrengths,
      improvements: uniqueImprovements,
      actionItems,
      recommendedResources,
      nextSteps,
    };
  }
}

// ============================================================
// Export Functions
// ============================================================

export function createInterviewSession(
  userId: string,
  mode: InterviewMode,
  targetRole: string,
  userProjects: Project[],
  userSkills: string[]
): Promise<InterviewSession> {
  const simulator = new InterviewSimulator();
  return simulator.generateSession(userId, mode, targetRole, userProjects, userSkills);
}

export async function evaluateInterviewAnswer(
  session: InterviewSession,
  questionId: string,
  answer: string,
  duration: number
): Promise<InterviewAnswer> {
  const simulator = new InterviewSimulator();
  return simulator.evaluateAnswer(session, questionId, answer, duration);
}

export async function completeInterviewSession(session: InterviewSession): Promise<InterviewSession> {
  const simulator = new InterviewSimulator();
  return simulator.completeSession(session);
}

export function getQuestionsForMode(mode: InterviewMode): InterviewQuestion[] {
  const simulator = new InterviewSimulator();
  // Access private method via instance
  const questions: InterviewQuestion[] = [];
  for (const [, questionsList] of Object.entries(QUESTION_BANK)) {
    for (const q of questionsList) {
      if (matchesMode(q.type, mode)) {
        questions.push(q);
      }
    }
  }
  return questions;
}

function matchesMode(type: QuestionType, mode: InterviewMode): boolean {
  if (mode === 'mixed') return true;
  if (mode === 'technical') return ['technical', 'coding', 'debugging', 'architecture', 'tradeoffs', 'system-design'].includes(type);
  if (mode === 'system-design') return type === 'system-design';
  if (mode === 'behavioral') return type === 'behavioral';
  if (mode === 'screening') return ['technical', 'behavioral'].includes(type);
  return false;
}

export { QUESTION_BANK };
// Types are already exported at their definition
// No need for explicit re-export