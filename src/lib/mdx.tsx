/* eslint-disable */
/**
 * MDX Blog/Notes System with Syntax Highlighting
 *
 * Features:
 * - MDX compilation with Next.js 15
 * - Syntax highlighting with Shiki
 * - Frontmatter parsing and validation
 * - Custom MDX components (Callout, Tabs, CodeBlock, etc.)
 * - Reading time calculation
 * - Table of contents generation
 * - SEO metadata extraction
 */

import React from 'react';
import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getHighlighter } from 'shiki';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// ============================================================
// Types
// ============================================================

export interface MDXFrontmatter {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  slug: string;
  coverImage?: string;
  draft?: boolean;
  featured?: boolean;
  readingTime?: string;
  toc?: boolean;
}

export interface MDXContent {
  frontmatter: MDXFrontmatter;
  content: React.ReactNode;
  slug: string;
  readingTime: string;
  toc: TOCItem[];
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

export interface MDXFile {
  slug: string;
  frontmatter: MDXFrontmatter;
  content: string;
  filePath: string;
}

// ============================================================
// Paths
// ============================================================

const NOTES_DIR = path.join(process.cwd(), 'content/notes');
const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// ============================================================
// Shiki Highlighter
// ============================================================

let highlighterInstance: Awaited<ReturnType<typeof getHighlighter>> | null = null;

export async function getHighlighterInstance() {
  if (!highlighterInstance) {
    highlighterInstance = await getHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [
        'typescript', 'javascript', 'python', 'rust', 'go',
        'html', 'css', 'scss', 'json', 'yaml', 'markdown',
        'bash', 'dockerfile', 'sql', 'graphql', 'regex',
        'cpp', 'c', 'csharp', 'java', 'kotlin', 'swift',
      ],
    });
  }
  return highlighterInstance;
}

// ============================================================
// Custom MDX Components
// ============================================================

export const mdxComponents = {
  // Callout boxes
  Callout: ({ type = 'info', title, children }: {
    type?: 'info' | 'warning' | 'danger' | 'success' | 'tip';
    title?: string;
    children: React.ReactNode;
  }) => {
    const styles: Record<string, { bg: string; border: string; icon: string }> = {
      info: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', icon: 'ℹ️' },
      warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', icon: '⚠️' },
      danger: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: '🚨' },
      success: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', icon: '✅' },
      tip: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', icon: '💡' },
    };

    const style = styles[type] || styles.info;

    return (
      <div className={`p-4 rounded-lg border ${style.bg} ${style.border} my-4`}>
        <div className="flex items-start gap-3">
          <span className="text-lg">{style.icon}</span>
          <div>
            {title && <h4 className="font-semibold mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
          </div>
        </div>
      </div>
    );
  },

  // Tabs component
  Tabs: ({ children, defaultTab }: { children: React.ReactNode; defaultTab?: string }) => {
    const [activeTab, setActiveTab] = React.useState(defaultTab || '');

    return (
      <div className="my-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4" role="tablist">
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return null;
            const element = child as React.ReactElement<{ name?: string; id?: string; label?: string }>;
            const tab = element.props.name || element.props.id || `tab-${index}`;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {element.props.label || tab}
              </button>
            );
          })}
        </div>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const element = child as React.ReactElement<{ name?: string; id?: string; label?: string; children?: React.ReactNode }>;
          const tab = element.props.name || element.props.id || `tab-${index}`;
          return (
            <div key={tab} role="tabpanel" hidden={activeTab !== tab}>
              {element.props.children}
            </div>
          );
        })}
      </div>
    );
  },

  Tab: ({ name, label, children }: { name: string; label: string; children: React.ReactNode }) => (
    <div>{children}</div>
  ),

  // Code block with copy button
  CodeBlock: ({ code, language = 'text', filename }: {
    code: string;
    language?: string;
    filename?: string;
  }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative my-4 rounded-lg overflow-hidden bg-gray-900 dark:bg-gray-950">
        {(filename || language) && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
            <span className="text-sm font-mono text-gray-400">{filename || language}</span>
            <button
              onClick={handleCopy}
              className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
        <pre className="p-4 overflow-x-auto text-sm"><code className={`language-${language}`}>{code}</code></pre>
      </div>
    );
  },

  // Table of Contents
  TableOfContents: ({ items }: { items: TOCItem[] }) => {
    if (!items.length) return null;

    const renderTOC = (items: TOCItem[], depth = 0) => (
      <ul className={`${depth > 0 ? 'ml-6' : ''} space-y-1`}>
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`text-sm transition-colors ${depth > 0 ? 'text-gray-500 dark:text-gray-400' : 'font-medium'}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  history.pushState(null, '', `#${item.id}`);
                }
              }}
            >
              {item.text}
            </a>
            {item.children && renderTOC(item.children, depth + 1)}
          </li>
        ))}
      </ul>
    );

    return (
      <nav className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Table of Contents</h3>
        {renderTOC(items)}
      </nav>
    );
  },

  // Reading time
  ReadingTime: ({ minutes }: { minutes: string }) => (
    <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {minutes} min read
    </span>
  ),

  // Image with caption
  Figure: ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
    <figure className="my-6">
      <img src={src} alt={alt} className="w-full rounded-lg shadow-lg" />
      {caption && <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</figcaption>}
    </figure>
  ),

  // Standard HTML elements with enhanced styling
  h1: (props: any) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" />,
  h2: (props: any) => <h2 {...props} className="text-2xl font-bold mt-8 mb-3 text-gray-800 dark:text-gray-100" />,
  h3: (props: any) => <h3 {...props} className="text-xl font-bold mt-6 mb-2 text-gray-700 dark:text-gray-200" />,
  h4: (props: any) => <h4 {...props} className="text-lg font-bold mt-4 mb-2 text-gray-700 dark:text-gray-200" />,
  p: (props: any) => <p {...props} className="leading-relaxed text-gray-700 dark:text-gray-300 mb-4" />,
  a: (props: any) => <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" />,
  ul: (props: any) => <ul {...props} className="list-disc list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300" />,
  ol: (props: any) => <ol {...props} className="list-decimal list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300" />,
  li: (props: any) => <li {...props} className="ml-4" />,
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4" />
  ),
  code: (props: any) => <code {...props} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400" />,
  pre: (props: any) => <pre {...props} className="bg-gray-900 dark:bg-gray-950 p-4 rounded-lg overflow-x-auto my-4" />,
  hr: (props: any) => <hr {...props} className="border-gray-200 dark:border-gray-700 my-8" />,
  table: (props: any) => <div className="overflow-x-auto my-4"><table {...props} className="w-full border-collapse" /></div>,
  th: (props: any) => <th {...props} className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-800" />,
  td: (props: any) => <td {...props} className="border border-gray-200 dark:border-gray-700 px-4 py-2" />,
};

// ============================================================
// MDX Compilation
// ============================================================

export async function compileMDXContent(source: string, frontmatter: MDXFrontmatter) {
  const { content, frontmatter: compiledFrontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
    },
  });

  return { content, frontmatter: { ...frontmatter, ...compiledFrontmatter } as MDXFrontmatter };
}

// ============================================================
// File System Operations
// ============================================================

function getContentDirs(): string[] {
  const dirs: string[] = [];
  if (fs.existsSync(NOTES_DIR)) dirs.push(NOTES_DIR);
  if (fs.existsSync(BLOG_DIR)) dirs.push(BLOG_DIR);
  return dirs;
}

function getAllMDXFiles(): MDXFile[] {
  const files: MDXFile[] = [];
  const dirs = getContentDirs();

  for (const dir of dirs) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const filePath = path.join(dir, entry.name);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter } = matter(content);
        const slug = entry.name.replace('.mdx', '');

        files.push({
          slug,
          frontmatter: frontmatter as MDXFrontmatter,
          content,
          filePath,
        });
      }
    }
  }

  return files;
}

export function getAllNotes(): MDXFile[] {
  return getAllMDXFiles()
    .filter(f => f.frontmatter.category === 'note' || f.filePath.includes('/notes/'))
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getAllBlogPosts(): MDXFile[] {
  return getAllMDXFiles()
    .filter(f => f.frontmatter.category === 'blog' || f.filePath.includes('/blog/'))
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getNoteBySlug(slug: string): MDXFile | null {
  const files = getAllNotes();
  return files.find(f => f.slug === slug) || null;
}

export function getBlogPostBySlug(slug: string): MDXFile | null {
  const files = getAllBlogPosts();
  return files.find(f => f.slug === slug) || null;
}

export function getContentBySlug(slug: string): MDXFile | null {
  return getNoteBySlug(slug) || getBlogPostBySlug(slug);
}

// ============================================================
// Content Processing
// ============================================================

function generateTOC(content: string): TOCItem[] {
  const headings = content.match(/^(#{1,6})\s+(.+)$/gm) || [];
  const toc: TOCItem[] = [];
  const stack: TOCItem[] = [];

  for (const heading of headings) {
    const match = heading.match(/^(#+)\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');

    const item: TOCItem = { id, text, level };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }

    stack.push(item);
  }

  return toc;
}

export async function processMDXFile(file: MDXFile): Promise<MDXContent> {
  const { content, data: frontmatter } = matter(file.content);

  // Calculate reading time
  const readingTimeResult = readingTime(content);
  const readingTimeStr = readingTimeResult.text;

  // Generate TOC
  const toc = generateTOC(content);

  // Compile MDX
  const { content: compiledContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  return {
    frontmatter: {
      ...frontmatter,
      readingTime: frontmatter.readingTime || readingTimeStr,
      toc: frontmatter.toc !== false,
    } as MDXFrontmatter,
    content: compiledContent,
    slug: file.slug,
    readingTime: readingTimeStr,
    toc,
  };
}

export async function getProcessedNote(slug: string): Promise<MDXContent | null> {
  const file = getNoteBySlug(slug);
  if (!file) return null;
  return processMDXFile(file);
}

export async function getProcessedBlogPost(slug: string): Promise<MDXContent | null> {
  const file = getBlogPostBySlug(slug);
  if (!file) return null;
  return processMDXFile(file);
}

// ============================================================
// RSS/Atom Feed Generation
// ============================================================

export function generateRSSFeed(posts: MDXFile[], siteUrl: string): string {
  const items = posts.slice(0, 20).map(post => `
    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${siteUrl}/notes/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/notes/${post.slug}</guid>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.frontmatter.description}]]></description>
      <category>${post.frontmatter.category}</category>
      ${post.frontmatter.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Elios Mernica - Notes</title>
    <link>${siteUrl}/notes</link>
    <description>Technical notes and insights from Elios Mernica</description>
    <language>en</language>
    <atom:link href="${siteUrl}/notes/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

export function generateAtomFeed(posts: MDXFile[], siteUrl: string): string {
  const entries = posts.slice(0, 20).map(post => `
    <entry>
      <title>${post.frontmatter.title}</title>
      <link href="${siteUrl}/notes/${post.slug}"/>
      <id>${siteUrl}/notes/${post.slug}</id>
      <updated>${new Date(post.frontmatter.updatedAt || post.frontmatter.date).toISOString()}</updated>
      <summary type="html">${post.frontmatter.description}</summary>
      <author><name>Elios Mernica</name></author>
      <category term="${post.frontmatter.category}"/>
      ${post.frontmatter.tags.map(tag => `<category term="${tag}"/>`).join('')}
    </entry>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Elios Mernica - Notes</title>
  <link href="${siteUrl}/notes" rel="alternate"/>
  <link href="${siteUrl}/notes/atom.xml" rel="self"/>
  <id>${siteUrl}/notes</id>
  <updated>${new Date().toISOString()}</updated>
  <author><name>Elios Mernica</name></author>
  ${entries}
</feed>`;
}

// ============================================================
// Sitemap Generation
// ============================================================

export function generateSitemap(posts: MDXFile[], siteUrl: string): string {
  const urls = posts.map(post => `
    <url>
      <loc>${siteUrl}/notes/${post.slug}</loc>
      <lastmod>${new Date(post.frontmatter.updatedAt || post.frontmatter.date).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}

// ============================================================
// JSON Feed Generation
// ============================================================

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/parser */
export function generateJSONFeed(posts: MDXFile[], siteUrl: string): string {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Elios Mernica - Notes',
    home_page_url: `${siteUrl}/notes`,
    feed_url: `${siteUrl}/notes/feed.json`,
    description: 'Technical notes and insights from Elios Mernica',
    author: {
      name: 'Elios Mernica',
      url: siteUrl,
    },
    items: posts.slice(0, 20).map(post => ({
      id: `${siteUrl}/notes/${post.slug}`,
      url: `${siteUrl}/notes/${post.slug}`,
      title: post.frontmatter.title,
      content_html: post.frontmatter.description,
      date_published: post.frontmatter.date,
      date_modified: post.frontmatter.updatedAt || post.frontmatter.date,
      tags: post.frontmatter.tags,
      author: { name: 'Elios Mernica' },
    })),
  };

  return JSON.stringify(feed, null, 2);
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/parser */

// ============================================================
// Export
// ============================================================

// Types (MDXFrontmatter, MDXContent, MDXFile, TOCItem), functions, and mdxComponents
// are all exported at their definitions - no explicit re-exports needed