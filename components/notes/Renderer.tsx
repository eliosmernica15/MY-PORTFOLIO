import { Info, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import type { NoteBlock } from '@/data/notes';
import { CopyButton } from './CopyButton';

export function NoteRenderer({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <div className="prose-content space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {block.text}
              </p>
            );
          case 'h2':
            return (
              <h2 key={i} className="text-2xl sm:text-3xl font-black tracking-tight mt-12 mb-4" style={{ color: 'var(--text-primary)' }}>
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="text-xl sm:text-2xl font-bold tracking-tight mt-8 mb-3" style={{ color: 'var(--text-primary)' }}>
                {block.text}
              </h3>
            );
          case 'code':
            return (
              <div key={i} className="relative group my-6">
                <pre
                  className="p-5 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <code className={`language-${block.lang}`}>{block.code}</code>
                </pre>
                <CopyButton text={block.code} />
              </div>
            );
          case 'list':
            if (block.ordered) {
              return (
                <ol key={i} className="space-y-2 pl-6 list-decimal marker:opacity-50" style={{ color: 'var(--text-secondary)' }}>
                  {block.items.map((item, j) => (
                    <li key={j} className="text-base leading-relaxed">{item}</li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={i} className="space-y-2 pl-6 list-disc marker:opacity-50" style={{ color: 'var(--text-secondary)' }}>
                {block.items.map((item, j) => (
                  <li key={j} className="text-base leading-relaxed">{item}</li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-2 pl-6 py-2 my-6 italic text-lg"
                style={{ borderColor: 'var(--accent)', color: 'var(--text-secondary)' }}
              >
                <p>"{block.text}"</p>
                {block.cite && <cite className="block mt-2 text-sm not-italic opacity-70">— {block.cite}</cite>}
              </blockquote>
            );
          case 'callout':
            return <Callout key={i} tone={block.tone} text={block.text} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function Callout({ tone, text }: { tone: 'info' | 'warn' | 'success'; text: string }) {
  const config = {
    info: { icon: Info, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.25)' },
    warn: { icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.25)' },
    success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.25)' },
  }[tone];
  const Icon = config.icon;
  return (
    <div
      className="flex gap-3 p-4 sm:p-5 rounded-2xl my-6"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
      role="note"
    >
      <Icon size={20} style={{ color: config.color }} className="shrink-0 mt-0.5" />
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {text}
      </p>
    </div>
  );
}
