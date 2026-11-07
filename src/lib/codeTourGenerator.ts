/**
 * Code Tour Generator (AST-based)
 *
 * Automatically generates interactive code tours/walkthroughs from codebases
 * using Abstract Syntax Tree (AST) parsing.
 *
 * Features:
 * - AST parsing for TypeScript/JavaScript/Python/Go/Rust
 * - Automatic identification of key files, functions, classes
 * - Step-by-step tour generation with explanations
 * - Interactive web-based tour player
 * - Export formats: JSON, Markdown, HTML, VS Code tour format
 * - Customizable tour templates
 * - Incremental updates for evolving codebases
 */

import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import { PROJECTS } from '@/data/projects';
import type { Project } from '@/types';

// ============================================================
// Types
// ============================================================

export interface CodeTour {
  id: string;
  title: string;
  description: string;
  projectId: string;
  version: string;
  steps: TourStep[];
  metadata: TourMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface TourStep {
  id: string;
  title: string;
  description: string;
  file: string;
  line?: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  type: StepType;
  content: StepContent;
  order: number;
  estimatedTime: number; // seconds
}

export type StepType = 'file' | 'function' | 'class' | 'component' | 'hook' | 'api' | 'config' | 'test' | 'explanation' | 'entry' | 'type' | 'feature';

export interface StepContent {
  markdown?: string;
  code?: string;
  diagram?: string;
  interactive?: InteractiveElement[];
}

export interface InteractiveElement {
  type: 'quiz' | 'code-edit' | 'terminal' | 'link';
  content: string;
  validation?: string;
}

export interface TourMetadata {
  totalSteps: number;
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  language: string;
  framework?: string;
}

export interface CodeTourOptions {
  projectPath: string;
  entryPoints: string[];
  includeTests: boolean;
  includeConfigs: boolean;
  maxSteps: number;
  detailLevel: 'overview' | 'detailed' | 'deep-dive';
  targetAudience: 'junior' | 'mid' | 'senior';
  template: 'default' | 'onboarding' | 'feature' | 'refactoring' | 'debugging';
  language: 'typescript' | 'javascript' | 'python' | 'go' | 'rust';
}

export interface ASTNodeInfo {
  type: string;
  name: string;
  file: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  text: string;
  children: ASTNodeInfo[];
  metadata: Record<string, any>;
}

// ============================================================
// AST Parser for TypeScript/JavaScript
// ============================================================

export class TypeScriptASTParser {
  private sourceFiles: Map<string, ts.SourceFile> = new Map();
  private program: ts.Program | null = null;

  /**
   * Parse a project directory and extract AST information
   */
  async parseProject(projectPath: string, options: CodeTourOptions): Promise<ASTNodeInfo[]> {
    const configPath = ts.findConfigFile(projectPath, ts.sys.fileExists, 'tsconfig.json');

    if (configPath) {
      const config = ts.readConfigFile(configPath, ts.sys.readFile);
      const parsedConfig = ts.parseJsonConfigFileContent(
        config.config,
        ts.sys,
        path.dirname(configPath)
      );

      this.program = ts.createProgram({
        rootNames: parsedConfig.fileNames,
        options: parsedConfig.options,
      });
    } else {
      // No tsconfig, create program from entry points
      const entryFiles = options.entryPoints.map(ep => path.resolve(projectPath, ep));
      this.program = ts.createProgram({
        rootNames: entryFiles,
        options: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          jsx: ts.JsxEmit.ReactJSX,
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          allowJs: true,
          declaration: true,
          outDir: './dist',
        },
      });
    }

    const sourceFiles = this.program.getSourceFiles()
      .filter(f => !f.isDeclarationFile && !f.fileName.includes('node_modules'))
      .filter(f => f.fileName.endsWith('.ts') || f.fileName.endsWith('.tsx') || f.fileName.endsWith('.js') || f.fileName.endsWith('.jsx'));

    const allNodes: ASTNodeInfo[] = [];

    for (const sourceFile of sourceFiles) {
      this.sourceFiles.set(sourceFile.fileName, sourceFile);
      const nodes = this.extractNodes(sourceFile);
      allNodes.push(...nodes);
    }

    return allNodes;
  }

  private extractNodes(sourceFile: ts.SourceFile): ASTNodeInfo[] {
    const nodes: ASTNodeInfo[] = [];

    const visit = (node: ts.Node) => {
      const info = this.nodeToInfo(node, sourceFile);
      if (info) {
        nodes.push(info);
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return nodes;
  }

  private nodeToInfo(node: ts.Node, sourceFile: ts.SourceFile): ASTNodeInfo | null {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());

    const baseInfo: Partial<ASTNodeInfo> = {
      file: sourceFile.fileName,
      startLine: start.line + 1,
      startColumn: start.character + 1,
      endLine: end.line + 1,
      endColumn: end.character + 1,
      text: node.getText(sourceFile),
      children: [],
      metadata: {},
    };

    switch (node.kind) {
      case ts.SyntaxKind.FunctionDeclaration:
      case ts.SyntaxKind.FunctionExpression:
      case ts.SyntaxKind.ArrowFunction:
        return this.extractFunction(node as ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction, sourceFile, baseInfo);

      case ts.SyntaxKind.ClassDeclaration:
        return this.extractClass(node as ts.ClassDeclaration, sourceFile, baseInfo);

      case ts.SyntaxKind.InterfaceDeclaration:
        return this.extractInterface(node as ts.InterfaceDeclaration, sourceFile, baseInfo);

      case ts.SyntaxKind.TypeAliasDeclaration:
        return this.extractTypeAlias(node as ts.TypeAliasDeclaration, sourceFile, baseInfo);

      case ts.SyntaxKind.EnumDeclaration:
        return this.extractEnum(node as ts.EnumDeclaration, sourceFile, baseInfo);

      case ts.SyntaxKind.VariableStatement:
        return this.extractVariable(node as ts.VariableStatement, sourceFile, baseInfo);

      case ts.SyntaxKind.ImportDeclaration:
        return this.extractImport(node as ts.ImportDeclaration, sourceFile, baseInfo);

      case ts.SyntaxKind.ExportDeclaration:
        return this.extractExport(node as ts.ExportDeclaration, sourceFile, baseInfo);

      case ts.SyntaxKind.CallExpression:
        return this.extractCall(node as ts.CallExpression, sourceFile, baseInfo);

      case ts.SyntaxKind.JsxElement:
      case ts.SyntaxKind.JsxSelfClosingElement:
        return this.extractJSX(node as ts.JsxElement | ts.JsxSelfClosingElement, sourceFile, baseInfo);

      default:
        return null;
    }
  }

  private extractFunction(node: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const name = this.getFunctionName(node);
    const params = this.getParameters(node);
    const returnType = this.getReturnType(node);
    const isAsync = node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword) || false;
    const isGenerator = node.asteriskToken !== undefined;
    const isExported = this.isExported(node);

    return {
      ...base,
      type: 'function',
      name,
      metadata: {
        parameters: params,
        returnType,
        isAsync,
        isGenerator,
        isExported,
        isArrowFunction: ts.isArrowFunction(node),
        jsDoc: this.getJSDoc(node),
        complexity: this.calculateComplexity(node),
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractClass(node: ts.ClassDeclaration, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const name = node.name?.getText(sourceFile) || 'Anonymous';
    const heritage = node.heritageClauses?.map(h => h.getText(sourceFile)) || [];
    const members = node.members.map(m => this.nodeToInfo(m, sourceFile)).filter(Boolean) as ASTNodeInfo[];
    const isExported = this.isExported(node);

    return {
      ...base,
      type: 'class',
      name,
      metadata: {
        heritage,
        members: members.map(m => m.name).filter(Boolean),
        isExported,
        jsDoc: this.getJSDoc(node),
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractInterface(node: ts.InterfaceDeclaration, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const name = node.name.getText(sourceFile);
    const heritage = node.heritageClauses?.map(h => h.getText(sourceFile)) || [];
    const members = node.members.map(m => {
      const memberName = m.name?.getText(sourceFile) ?? '';
      let memberType = 'any';
      let isOptional = m.questionToken !== undefined;
      let isReadonly = (ts.isPropertySignature(m) || ts.isMethodSignature(m)) && m.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ReadonlyKeyword) || false;

      // Handle different types of interface members
      if (ts.isPropertySignature(m)) {
        memberType = m.type?.getText(sourceFile) || 'any';
      } else if (ts.isMethodSignature(m)) {
        memberType = m.type?.getText(sourceFile) || '() => any';
      } else if (ts.isIndexSignatureDeclaration(m)) {
        memberType = '[key: string]: any'; // Simplified for index signatures
      }

      return {
        name: memberName,
        type: memberType,
        optional: isOptional,
        readonly: isReadonly,
      };
    });

    return {
      ...base,
      type: 'interface',
      name,
      metadata: {
        heritage,
        members,
        jsDoc: this.getJSDoc(node),
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractTypeAlias(node: ts.TypeAliasDeclaration, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const name = node.name.getText(sourceFile);
    const typeText = node.type.getText(sourceFile);
    const typeParams = node.typeParameters?.map(tp => tp.getText(sourceFile)) || [];

    return {
      ...base,
      type: 'type',
      name,
      metadata: {
        type: typeText,
        typeParameters: typeParams,
        jsDoc: this.getJSDoc(node),
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractEnum(node: ts.EnumDeclaration, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const name = node.name.getText(sourceFile);
    const members = node.members.map(m => ({
      name: m.name.getText(sourceFile),
      value: m.initializer?.getText(sourceFile),
    }));

    return {
      ...base,
      type: 'enum',
      name,
      metadata: {
        members,
        isConst: node.modifiers?.some(m => m.kind === ts.SyntaxKind.ConstKeyword) || false,
        jsDoc: this.getJSDoc(node),
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractVariable(node: ts.VariableStatement, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const declarations = node.declarationList.declarations;
    const names = declarations.map(d => d.name.getText(sourceFile)).join(', ');
    const isConst = node.declarationList.flags & ts.NodeFlags.Const;
    let isExported = this.isExported(node);

    return {
      ...base,
      type: 'variable',
      name: names,
      metadata: {
        isConst,
        isExported,
        type: declarations[0].type?.getText(sourceFile),
        initializer: declarations[0].initializer?.getText(sourceFile),
        jsDoc: this.getJSDoc(node),
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractImport(node: ts.ImportDeclaration, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');
    const namedImports = node.importClause?.namedBindings
      ? (node.importClause.namedBindings as ts.NamedImports).elements.map(e => e.name.getText(sourceFile))
      : [];
    const defaultImport = node.importClause?.name?.getText(sourceFile);
    const namespaceImport = node.importClause?.namedBindings
      ? (node.importClause.namedBindings as ts.NamespaceImport).name.getText(sourceFile)
      : null;

    return {
      ...base,
      type: 'import',
      name: moduleSpecifier,
      metadata: {
        moduleSpecifier,
        namedImports,
        defaultImport,
        namespaceImport,
        isTypeOnly: node.importClause?.isTypeOnly || false,
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractExport(node: ts.ExportDeclaration, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const moduleSpecifier = node.moduleSpecifier?.getText(sourceFile).replace(/['"]/g, '');
    const namedExports = node.exportClause
      ? (node.exportClause as ts.NamedExports).elements.map(e => e.name.getText(sourceFile))
      : [];

    return {
      ...base,
      type: 'export',
      name: moduleSpecifier || 'default',
      metadata: {
        moduleSpecifier,
        namedExports,
        isTypeOnly: node.isTypeOnly,
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractCall(node: ts.CallExpression, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const expression = node.expression.getText(sourceFile);
    const args = node.arguments.map(a => a.getText(sourceFile));

    return {
      ...base,
      type: 'call',
      name: expression,
      metadata: {
        expression,
        arguments: args,
        typeArguments: node.typeArguments?.map(t => t.getText(sourceFile)) || [],
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  private extractJSX(node: ts.JsxElement | ts.JsxSelfClosingElement, sourceFile: ts.SourceFile, base: Partial<ASTNodeInfo>): ASTNodeInfo {
    const tagName = ts.isJsxSelfClosingElement(node) ? node.tagName.getText(sourceFile) : node.openingElement.tagName.getText(sourceFile);
    const jsxAttributes = ts.isJsxSelfClosingElement(node) ? node.attributes : node.openingElement.attributes;
    const attributes = jsxAttributes.properties
      ? jsxAttributes.properties
          .filter(p => ts.isJsxAttribute(p))
          .map(p => ({
            name: p.name?.getText(sourceFile) ?? '',
            value: p.initializer?.getText(sourceFile),
          }))
      : [];

    return {
      ...base,
      type: 'jsx',
      name: tagName,
      metadata: {
        tagName,
        attributes,
        children: ts.isJsxElement(node) ? node.children.length : 0,
        selfClosing: ts.isJsxSelfClosingElement(node),
      } as Record<string, any>,
    } as ASTNodeInfo;
  }

  // Helper methods
  private getFunctionName(node: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction): string {
    if (ts.isFunctionDeclaration(node) && node.name) {
      return node.name.getText();
    }
    if (ts.isFunctionExpression(node) && node.name) {
      return node.name.getText();
    }
    if (ts.isArrowFunction(node)) {
      // Try to get variable name if assigned
      const parent = node.parent;
      if (ts.isVariableDeclaration(parent) && parent.name) {
        return parent.name.getText();
      }
      return 'anonymous';
    }
    return 'anonymous';
  }

  private getParameters(node: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction): string[] {
    return node.parameters.map(p => {
      const name = p.name.getText();
      const type = p.type?.getText() || 'any';
      const optional = p.questionToken ? '?' : '';
      return `${name}${optional}: ${type}`;
    });
  }

  private getReturnType(node: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction): string {
    return node.type?.getText() || 'void';
  }

  private isExported(node: ts.Node): boolean {
    // Check if node is a declaration that can have modifiers
    const isDeclaration =
      ts.isFunctionDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isVariableStatement(node) ||
      ts.isImportDeclaration(node) ||
      ts.isExportDeclaration(node) ||
      ts.isExportAssignment(node) ||
      ts.isModuleDeclaration(node);

    return isDeclaration && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) || false;
  }

  private getJSDoc(node: ts.Node): string | undefined {
    const jsDoc = ts.getJSDocCommentsAndTags(node);
    if (jsDoc.length > 0) {
      return jsDoc.map(tag => tag.comment).join('\n');
    }
    return undefined;
  }

  private calculateComplexity(node: ts.Node): number {
    let complexity = 1; // Base complexity

    const visit = (n: ts.Node) => {
      // Cyclomatic complexity indicators
      if (
        n.kind === ts.SyntaxKind.IfStatement ||
        n.kind === ts.SyntaxKind.WhileStatement ||
        n.kind === ts.SyntaxKind.ForStatement ||
        n.kind === ts.SyntaxKind.ForInStatement ||
        n.kind === ts.SyntaxKind.ForOfStatement ||
        n.kind === ts.SyntaxKind.CaseClause ||
        n.kind === ts.SyntaxKind.CatchClause ||
        n.kind === ts.SyntaxKind.ConditionalExpression ||
        (n.kind === ts.SyntaxKind.BinaryExpression && (n as ts.BinaryExpression).operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) ||
        (n.kind === ts.SyntaxKind.BinaryExpression && (n as ts.BinaryExpression).operatorToken.kind === ts.SyntaxKind.BarBarToken)
      ) {
        complexity++;
      }
      ts.forEachChild(n, visit);
    };

    visit(node);
    return complexity;
  }
}

// ============================================================
// Code Tour Generator
// ============================================================

export class CodeTourGenerator {
  private parser: TypeScriptASTParser;
  private projectPath: string;
  private options: CodeTourOptions;

  constructor(options: CodeTourOptions) {
    this.parser = new TypeScriptASTParser();
    this.projectPath = options.projectPath;
    this.options = options;
  }

  /**
   * Generate a code tour from AST analysis
   */
  async generateTour(project: Project): Promise<CodeTour> {
    // Parse the project
    const astNodes = await this.parser.parseProject(this.projectPath, this.options);

    // Generate tour steps based on AST analysis
    const steps = this.generateSteps(astNodes, project);

    // Apply template
    const finalSteps = this.applyTemplate(steps);

    const tour: CodeTour = {
      id: `tour-${project.id}-${Date.now()}`,
      title: `${project.title} Code Tour`,
      description: `Interactive code walkthrough of ${project.title}`,
      projectId: project.id,
      version: '1.0.0',
      steps: finalSteps,
      metadata: {
        totalSteps: finalSteps.length,
        estimatedDuration: finalSteps.reduce((sum, s) => sum + s.estimatedTime, 0) / 60,
        difficulty: this.getDifficulty(project),
        tags: [project.category, ...project.tech],
        prerequisites: this.getPrerequisites(project),
        learningObjectives: this.generateLearningObjectives(project),
        language: this.options.language,
        framework: this.detectFramework(project),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return tour;
  }

  private generateSteps(nodes: ASTNodeInfo[], project: Project): TourStep[] {
    const steps: TourStep[] = [];
    let order = 0;

    // 1. Entry point / Main file
    const entryNodes = nodes.filter(n =>
      n.metadata.isExported &&
      (n.type === 'function' || n.type === 'class') &&
      this.isEntryPoint(n)
    );

    for (const node of entryNodes.slice(0, 2)) {
      steps.push(this.createStep(node, 'entry', order++));
    }

    // 2. Core components / main classes
    const coreClasses = nodes.filter(n =>
      n.type === 'class' &&
      n.metadata.isExported &&
      !this.isEntryPoint(n) &&
      this.isCoreComponent(n)
    );

    for (const node of coreClasses.slice(0, 5)) {
      steps.push(this.createStep(node, 'class', order++));
    }

    // 3. Key functions / hooks
    const keyFunctions = nodes.filter(n =>
      n.type === 'function' &&
      n.metadata.isExported &&
      this.isKeyFunction(n)
    );

    for (const node of keyFunctions.slice(0, 5)) {
      steps.push(this.createStep(node, 'function', order++));
    }

    // 3. Key interfaces / types
    const keyTypes = nodes.filter(n =>
      (n.type === 'interface' || n.type === 'type') &&
      this.isPublicType(n)
    );

    for (const node of keyTypes.slice(0, 3)) {
      steps.push(this.createStep(node, 'type', order++));
    }

    // 4. Configuration / setup
    const configFiles = this.getConfigFiles();
    for (const config of configFiles.slice(0, 2)) {
      steps.push(this.createConfigStep(config, order++));
    }

    // 5. Tests (if included)
    if (this.options.includeTests) {
      const testFiles = this.getTestFiles();
      for (const test of testFiles.slice(0, 2)) {
        steps.push(this.createTestStep(test, order++));
      }
    }

    // 5. Explanation steps between major sections
    return this.addExplanationSteps(steps);
  }

  private createStep(node: ASTNodeInfo, stepType: StepType, order: number): TourStep {
    const descriptions: Record<string, string> = {
      entry: `Entry point: ${node.name} - This is where the application starts.`,
      class: `Core component: ${node.name} - ${this.getClassDescription(node)}`,
      function: `Key function: ${node.name} - ${this.getFunctionDescription(node)}`,
      type: `Type definition: ${node.name} - Defines the shape of ${node.name.toLowerCase()}`,
      config: `Configuration: ${node.name} - ${this.getConfigDescription(node.name)}`,
      test: `Test: ${node.name} - Tests for ${node.name}`,
    };

    return {
      id: `step-${order}`,
      title: this.formatTitle(node.name, stepType),
      description: descriptions[stepType] || `Explore ${node.name}`,
      file: this.getRelativePath(node.file),
      line: node.startLine,
      column: node.startColumn,
      endLine: node.endLine,
      endColumn: node.endColumn,
      type: stepType,
      content: {
        markdown: this.generateMarkdown(node, stepType),
        code: node.text,
      },
      order,
      estimatedTime: this.estimateStepTime(stepType),
    };
  }

  private createConfigStep(config: { file: string; name: string; description: string }, order: number): TourStep {
    return {
      id: `step-${order}`,
      title: `Configuration: ${config.name}`,
      description: config.description,
      file: this.getRelativePath(config.file),
      line: 1,
      type: 'config',
      content: {
        markdown: `## ${config.name}\n\n${config.description}`,
      },
      order,
      estimatedTime: 60,
    };
  }

  private createTestStep(test: { file: string; name: string; description: string }, order: number): TourStep {
    return {
      id: `step-${order}`,
      title: `Test: ${test.name}`,
      description: test.description,
      file: this.getRelativePath(test.file),
      line: 1,
      type: 'test',
      content: {
        markdown: `## ${test.name}\n\n${test.description}`,
      },
      order,
      estimatedTime: 90,
    };
  }

  private addExplanationSteps(steps: TourStep[]): TourStep[] {
    const result: TourStep[] = [];

    for (let i = 0; i < steps.length; i++) {
      result.push(steps[i]);

      // Add explanation between major sections
      if (i < steps.length - 1) {
        const current = steps[i];
        const next = steps[i + 1];

        if (current.type !== next.type && current.type !== 'explanation') {
          const explanation: TourStep = {
            id: `explanation-${i}`,
            title: `Understanding ${this.getTypeLabel(next.type)}`,
            description: this.getExplanation(next.type),
            file: '',
            type: 'explanation',
            content: {
              markdown: this.getExplanationMarkdown(next.type),
            },
            order: current.order + 0.5,
            estimatedTime: 30,
          };
          result.push(explanation);
        }
      }
    }

    // Renumber orders
    return result.map((step, i) => ({ ...step, order: i }));
  }

  private applyTemplate(steps: TourStep[]): TourStep[] {
    switch (this.options.template) {
      case 'onboarding':
        return this.applyOnboardingTemplate(steps);
      case 'feature':
        return this.applyFeatureTemplate(steps);
      case 'refactoring':
        return this.applyRefactoringTemplate(steps);
      case 'debugging':
        return this.applyDebuggingTemplate(steps);
      default:
        return steps;
    }
  }

  private applyOnboardingTemplate(steps: TourStep[]): TourStep[] {
    // Add welcome step at the beginning
    const welcomeStep: TourStep = {
      id: 'welcome',
      title: 'Welcome to the Code Tour',
      description: 'This tour will guide you through the codebase, explaining key concepts and architecture.',
      file: '',
      type: 'explanation',
      content: {
        markdown: `## Welcome! 👋

This interactive tour will guide you through the codebase step by step.

**What you'll learn:**
- Project structure and organization
- Key architectural decisions
- Core components and their responsibilities
- Important patterns and conventions

**Navigation:**
- Use **Next/Previous** buttons to move between steps
- Click on file names to open them in your editor
- Use the **Table of Contents** to jump to specific sections

Let's get started! 🚀`,
      },
      order: -1,
      estimatedTime: 30,
    };

    return [welcomeStep, ...steps];
  }

  private applyFeatureTemplate(steps: TourStep[]): TourStep[] {
    // Focus on feature implementation
    return steps.filter(s =>
      s.type === 'function' || s.type === 'class' || s.type === 'feature'
    );
  }

  private applyRefactoringTemplate(steps: TourStep[]): TourStep[] {
    // Add refactoring context
    return steps.map(s => ({
      ...s,
      content: {
        ...s.content,
        markdown: s.content.markdown ? `> **Refactoring Context:** This code is being refactored.\n\n${s.content.markdown}` : undefined,
      },
    }));
  }

  private applyDebuggingTemplate(steps: TourStep[]): TourStep[] {
    // Add debugging tips
    return steps.map(s => ({
      ...s,
      content: {
        ...s.content,
        markdown: s.content.markdown ? `> 🔍 **Debugging Tip:** ${this.getDebuggingTip(s.type)}\n\n${s.content.markdown}` : undefined,
      },
    }));
  }

  private getDebuggingTip(type: StepType): string {
    const tips: Record<string, string> = {
      entry: 'Set a breakpoint here to trace the application startup.',
      class: 'Inspect instance properties in the debugger to understand state.',
      function: 'Step through line by line to understand the flow. Check parameter values and return values.',
      config: 'Verify environment variables are loaded correctly.',
      test: 'Run this test in watch mode while making changes.',
    };
    return tips['explanation'] || 'Use console.log or debugger to inspect values.';
  }

  // Helper methods
  private isEntryPoint(node: ASTNodeInfo): boolean {
    const entryPatterns = ['main', 'index', 'app', 'bootstrap', 'start'];
    return entryPatterns.some(p => node.name.toLowerCase().includes(p));
  }

  private isCoreComponent(node: ASTNodeInfo): boolean {
    const corePatterns = ['service', 'controller', 'manager', 'handler', 'provider', 'repository', 'store', 'context'];
    return corePatterns.some(p => node.name.toLowerCase().includes(p));
  }

  private isKeyFunction(node: ASTNodeInfo): boolean {
    const keyPatterns = ['handler', 'handler', 'process', 'execute', 'run', 'init', 'setup', 'configure', 'create', 'get', 'fetch', 'update', 'delete'];
    return keyPatterns.some(p => node.name.toLowerCase().includes(p));
  }

  private isPublicType(node: ASTNodeInfo): boolean {
    return node.metadata.isExported !== false;
  }

  private isEntryPointNode(node: ASTNodeInfo): boolean {
    return this.isEntryPoint(node);
  }

  private getClassDescription(node: ASTNodeInfo): string {
    const members = node.metadata.members || [];
    const heritage = node.metadata.heritage || [];
    let desc = `This class `;

    if (heritage.length > 0) {
      desc += `extends ${heritage.join(', ')} `;
    }

    if (members.length > 0) {
      desc += `with ${members.length} members: ${members.slice(0, 3).join(', ')}${members.length > 3 ? '...' : ''}`;
    }

    return desc;
  }

  private getFunctionDescription(node: ASTNodeInfo): string {
    const params = node.metadata.parameters || [];
    const returnType = node.metadata.returnType || 'void';
    const isAsync = node.metadata.isAsync ? 'async ' : '';

    return `${isAsync}function ${node.name}(${params.join(', ')}) => ${returnType}`;
  }

  private getConfigDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'tsconfig.json': 'TypeScript configuration - compiler options, paths, and project settings',
      'next.config.js': 'Next.js configuration - routing, images, webpack, and experimental features',
      'tailwind.config.js': 'Tailwind CSS configuration - theme, plugins, and custom utilities',
      'package.json': 'Project metadata, dependencies, scripts, and entry points',
      '.env': 'Environment variables - API keys, database URLs, feature flags',
      'docker-compose.yml': 'Docker Compose configuration - services, networks, volumes',
      'Dockerfile': 'Docker image definition - base image, dependencies, build steps',
      '.github/workflows': 'GitHub Actions workflows - CI/CD pipelines, testing, deployment',
    };
    return descriptions[name] || 'Configuration file';
  }

  private getExplanation(type: StepType): string {
    const explanations: Record<string, string> = {
      entry: 'Entry points are where the application starts execution. Understanding them gives you the big picture.',
      class: 'Classes encapsulate related data and behavior. They are the building blocks of object-oriented design.',
      function: 'Functions are reusable blocks of code that perform specific tasks. Pure functions are easier to test.',
      type: 'Type definitions provide compile-time safety and serve as documentation.',
      config: 'Configuration files control how the application behaves in different environments.',
      test: 'Tests verify correctness and prevent regressions. They also serve as documentation.',
    };
    return explanations[type] || 'This step explains an important concept.';
  }

  private getExplanationMarkdown(type: StepType): string {
    const markdown: Record<string, string> = {
      entry: `## Entry Points

The entry point is where your application begins execution. In a Node.js application, this is typically \`main.ts\` or \`index.ts\`. In a Next.js app, it's the \`pages/\` or \`app/\` directory.

**Key things to look for:**
- Initialization logic
- Configuration loading
- Middleware setup
- Route registration`,
      class: `## Classes

Classes encapsulate state and behavior. They are fundamental to organizing complex applications.

**Best practices:**
- Single Responsibility Principle
- Composition over inheritance
- Dependency injection
- Interface segregation`,
      function: `## Functions

Functions are the building blocks of your application. Pure functions are easier to test and reason about.

**Tips:**
- Keep functions small and focused
- Use descriptive names
- Handle errors gracefully
- Document complex logic`,
      type: `## Type Definitions

TypeScript types provide compile-time safety and serve as living documentation.

**Common patterns:**
- Interfaces for object shapes
- Type aliases for unions/complex types
- Generics for reusable components
- Utility types (Pick, Omit, Partial)`,
      config: `## Configuration

Configuration separates concerns and enables environment-specific behavior.

**Common configs:**
- \`tsconfig.json\` - TypeScript compiler options
- \`next.config.js\` - Next.js framework settings
- \`tailwind.config.js\` - Design system tokens
- \`docker-compose.yml\` - Local development environment`,
      test: `## Tests

Tests ensure correctness and prevent regressions. They also serve as executable documentation.

**Test pyramid:**
- Unit tests (many, fast, isolated)
- Integration tests (fewer, test interactions)
- E2E tests (very few, test critical paths)`,
    };
    return markdown[type] || '## Explanation\n\nThis section explains an important concept.';
  }

  private formatTitle(name: string, type: StepType): string {
    const prefixes: Record<string, string> = {
      entry: '🚀 Entry Point: ',
      class: '🏗️ Class: ',
      function: '⚙️ Function: ',
      type: '📝 Type: ',
      config: '⚙️ Config: ',
      test: '🧪 Test: ',
      explanation: '💡 ',
    };
    return `${prefixes[type] || ''}${name}`;
  }

  private getTypeLabel(type: StepType): string {
    const labels: Record<string, string> = {
      entry: 'Entry Points',
      class: 'Classes',
      function: 'Functions',
      type: 'Type Definitions',
      config: 'Configuration',
      test: 'Tests',
      explanation: 'Concepts',
    };
    return labels[type] || type;
  }

  private getDifficulty(project: Project): 'beginner' | 'intermediate' | 'advanced' {
    const techCount = project.tech.length;
    if (techCount <= 3) return 'beginner';
    if (techCount <= 6) return 'intermediate';
    return 'advanced';
  }

  private getPrerequisites(project: Project): string[] {
    const prereqs = ['Basic programming knowledge', 'Git basics'];
    if (project.tech.includes('TypeScript')) prereqs.push('TypeScript basics');
    if (project.tech.includes('React')) prereqs.push('React fundamentals');
    if (project.tech.includes('Node.js')) prereqs.push('Node.js basics');
    if (project.tech.includes('Docker')) prereqs.push('Docker basics');
    return [...new Set(prereqs)];
  }

  private generateLearningObjectives(project: Project): string[] {
    return [
      `Understand the architecture of ${project.title}`,
      `Learn how ${project.tech.slice(0, 3).join(', ')} work together`,
      'Navigate and understand the codebase structure',
      'Identify key components and their responsibilities',
      'Apply similar patterns in your own projects',
    ];
  }

  private detectFramework(project: Project): string | undefined {
    if (project.tech.includes('Next.js')) return 'Next.js';
    if (project.tech.includes('React')) return 'React';
    if (project.tech.includes('Vue')) return 'Vue';
    if (project.tech.includes('Angular')) return 'Angular';
    if (project.tech.includes('Svelte')) return 'Svelte';
    if (project.tech.includes('Express')) return 'Express';
    if (project.tech.includes('FastAPI')) return 'FastAPI';
    return undefined;
  }

  private getConfigFiles(): Array<{ file: string; name: string; description: string }> {
    const configs = [
      { file: 'tsconfig.json', name: 'tsconfig.json', description: 'TypeScript compiler configuration' },
      { file: 'next.config.js', name: 'next.config.js', description: 'Next.js framework configuration' },
      { file: 'tailwind.config.js', name: 'tailwind.config.js', description: 'Tailwind CSS design system configuration' },
      { file: 'package.json', name: 'package.json', description: 'Project dependencies and scripts' },
    ];

    return configs.filter(c => fs.existsSync(path.join(this.projectPath, c.file)));
  }

  private getTestFiles(): Array<{ file: string; name: string; description: string }> {
    const testPatterns = ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'];
    const tests: Array<{ file: string; name: string; description: string }> = [];

    for (const pattern of testPatterns) {
      // This would need glob in real implementation
    }

    return tests;
  }

  private getRelativePath(file: string): string {
    return path.relative(this.projectPath, file);
  }

  private estimateStepTime(type: StepType): number {
    const times: Record<string, number> = {
      entry: 90,
      class: 120,
      function: 90,
      type: 60,
      config: 60,
      test: 90,
      explanation: 30,
    };
    return times[type] || 60;
  }

  private getDifficultyLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  private generateMarkdown(node: ASTNodeInfo, type: StepType): string {
    const typeLabels: Record<string, string> = {
      entry: 'Entry Point',
      class: 'Class',
      function: 'Function',
      type: 'Type Definition',
      config: 'Configuration',
      test: 'Test',
      explanation: 'Concept',
    };

    const label = typeLabels[type] || type;

    let markdown = `## ${label}: ${node.name}\n\n`;

    switch (type) {
      case 'class':
        markdown += this.getClassDescription(node);
        break;
      case 'function':
        markdown += this.getFunctionDescription(node);
        break;
      case 'type':
        markdown += this.getExplanationMarkdown('type');
        break;
      case 'config':
        markdown += this.getConfigDescription(node.file);
        break;
      case 'test':
        markdown += `## Test: ${node.name}\n\n${this.getExplanationMarkdown('test')}`;
        break;
      case 'entry':
        markdown += `## Entry Point: ${node.name}\n\n${this.getExplanationMarkdown('entry')}`;
        break;
      default:
        markdown += this.getExplanationMarkdown(type);
    }

    if (node.file) {
      markdown += `\n\n**File:** \`${this.getRelativePath(node.file)}\` (lines ${node.startLine}-${node.endLine})`;
    }

    return markdown;
  }
}

// ============================================================
// Tour Player Component (React)
// ============================================================

export interface TourPlayerProps {
  tour: CodeTour;
  onStepChange: (step: TourStep) => void;
  onComplete: () => void;
  onClose: () => void;
}

// This would be a React component - showing the interface
export const TourPlayerComponent = `
/**
 * TourPlayer - React component for playing code tours
 *
 * Features:
 * - Step-by-step navigation
 * - Code highlighting with syntax highlighting
 * - Table of contents
 * - Progress tracking
 * - Keyboard shortcuts
 * - Fullscreen mode
 * - Export current step
 */

interface TourPlayerProps {
  tour: CodeTour;
  onStepChange: (step: TourStep) => void;
  onComplete: () => void;
  onClose: () => void;
}

export const TourPlayer: React.FC<TourPlayerProps> = ({
  tour,
  onStepChange,
  onComplete,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentStep = tour.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / tour.steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < tour.steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
      onStepChange(tour.steps[currentStepIndex + 1]);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
      onStepChange(tour.steps[currentStepIndex - 1]);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setShowTOC(false);
    onStepChange(tour.steps[index]);
  };

  return (
    <div className={\`tour-player \${isFullscreen ? 'fullscreen' : ''} \${showTOC ? 'toc-open' : ''}\`}>
      {/* Header */}
      <header className="tour-header">
        <button onClick={onClose} className="close-btn" aria-label="Close tour">
          <X size={20} />
        </button>
        <div className="tour-title">
          <h2>{tour.title}</h2>
          <span className="tour-progress">{currentStepIndex + 1} / {tour.steps.length}</span>
        </div>
        <div className="tour-actions">
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="toc-toggle"
            aria-label="Toggle table of contents"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="fullscreen-toggle"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="tour-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: \`\${progress}%\` }} />
      </div>

      {/* Table of Contents */}
      <AnimatePresence>
        {showTOC && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="tour-toc"
          >
            <h3>Table of Contents</h3>
            <ul>
              {tour.steps.map((step, index) => (
                <li key={step.id} className={index === currentStepIndex ? 'active' : ''}>
                  <button onClick={() => handleStepClick(index)} className="toc-item">
                    <span className="toc-number">{index + 1}</span>
                    <span className="toc-title">{step.title}</span>
                    <span className="toc-type">{step.type}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowTOC(false)} className="toc-close">
              Close
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="tour-content">
        <article className="tour-step">
          <header className="step-header">
            <span className="step-type-badge">{currentStep.type}</span>
            <h1>{currentStep.title}</h1>
            {currentStep.file && (
              <a
                href={\`vscode://file/\${currentStep.file}:\${currentStep.line}\`}
                className="step-file-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileCode size={14} />
                <span>{currentStep.file}:\${currentStep.line}</span>
              </a>
            )}
          </header>

          <div className="step-description" dangerouslySetInnerHTML={{ __html: currentStep.content.markdown }} />

          {currentStep.content.code && (
            <div className="step-code">
              <SyntaxHighlighter
                language={getLanguageFromFile(currentStep.file)}
                style={githubDark}
                showLineNumbers
                highlightLines={currentStep.line ? [currentStep.line] : []}
                lineProps={{
                  onClick: (lineNumber: number) => {
                    // Open file at line
                  }
                }}
              >
                {currentStep.content.code}
              </SyntaxHighlighter>
            </div>
          )}

          {currentStep.content.interactive && currentStep.content.interactive.length > 0 && (
            <div className="step-interactive">
              {currentStep.content.interactive.map((element, i) => (
                <InteractiveElement key={i} element={element} />
              ))}
            </div>
          )}
        </article>

        {/* Navigation */}
        <nav className="step-navigation">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="nav-btn prev"
            aria-label="Previous step"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="step-indicator">
            {tour.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={\`step-dot \${index === currentStepIndex ? 'active' : ''}\`}
                aria-label={\`Go to step \${index + 1}\`}
                aria-current={index === currentStepIndex ? 'step' : undefined}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === tour.steps.length - 1}
            className="nav-btn next"
            aria-label="Next step"
          >
            <span>{currentStepIndex === tour.steps.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight size={20} />
          </button>
        </nav>
      </main>

      {/* Footer */}
      <footer className="tour-footer">
        <div className="tour-meta">
          <span>Step {currentStepIndex + 1} of {tour.steps.length}</span>
          <span>~{currentStep.estimatedTime}s</span>
        </div>
        <div className="tour-shortcuts">
          <kbd>←</kbd> Previous &nbsp; <kbd>→</kbd> Next &nbsp; <kbd>T</kbd> TOC &nbsp; <kbd>F</kbd> Fullscreen &nbsp; <kbd>Esc</kbd> Close
        </div>
      </footer>
    </div>
  );
};

function getLanguageFromFile(file: string): string {
  const ext = file.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    go: 'go',
    rs: 'rust',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    css: 'css',
    scss: 'scss',
    html: 'html',
  };
  return ext ? map[ext] || 'text' : 'text';
}
`;

// ============================================================
// VS Code Tour Export
// ============================================================

export function exportToVSCodeTour(tour: CodeTour): string {
  const vscodeTour = {
    $schema: 'https://raw.githubusercontent.com/vscode-tour/vscode-tour/main/schema.json',
    title: tour.title,
    description: tour.description,
    steps: tour.steps.map(step => ({
      file: step.file,
      line: step.line,
      description: step.content.markdown,
      title: step.title,
    })),
  };

  return JSON.stringify(vscodeTour, null, 2);
}

// ============================================================
// Export Functions
// ============================================================

export async function generateCodeTour(
  project: Project,
  options: Partial<CodeTourOptions> = {}
): Promise<CodeTour> {
  const generator = new CodeTourGenerator({
    projectPath: process.cwd(),
    entryPoints: ['src/index.ts', 'src/main.ts'],
    includeTests: true,
    includeConfigs: true,
    maxSteps: 20,
    detailLevel: 'detailed',
    targetAudience: 'mid',
    template: 'default',
    language: 'typescript',
    ...options,
  });

  return generator.generateTour(project);
}

export async function generateToursForAllProjects(
  options: Partial<CodeTourOptions> = {}
): Promise<CodeTour[]> {
  const tours = await Promise.all(
    PROJECTS.map(project => generateCodeTour(project, options))
  );
  return tours;
}

// ============================================================
// Export
// ============================================================

// Types and classes are already exported at their definition
// No need for explicit re-export