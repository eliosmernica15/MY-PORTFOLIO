import { ArrowLeft, Home } from 'lucide-react';
import { AdvancedButton } from '@/components/ui/AdvancedButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PROJECTS } from '@/data/projects';

export default function NotFound() {
  const suggested = PROJECTS.slice(0, 3);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden z-[1]">
      <div className="text-center relative z-10 max-w-2xl animate-fade-up">
        <p className="status-live mx-auto mb-8 w-fit">
          <span className="status-live-dot" aria-hidden />
          Error 404
        </p>
        <h1
          className="text-[8rem] md:text-[11rem] font-black leading-none text-gradient-accent select-none"
          style={{ lineHeight: 0.85 }}
        >
          404
        </h1>
        <SectionHeader
          align="center"
          eyebrow="Page not found"
          title="This route doesn't exist."
          subtitle="The page you're looking for may have moved or never existed. Try one of these instead, or head home."
          className="!mb-10"
        />

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <AdvancedButton variant="primary" size="lg" href="/" icon={<Home size={18} />}>
            Back to Home
          </AdvancedButton>
          <AdvancedButton
            variant="secondary"
            size="lg"
            onClick={() => (typeof window !== 'undefined' ? window.history.back() : null)}
            icon={<ArrowLeft size={18} />}
          >
            Go Back
          </AdvancedButton>
        </div>

        <div className="text-left">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-center"
            style={{ color: 'var(--accent-light)' }}
          >
            Or explore a project
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggested.map(p => (
              <AdvancedButton key={p.id} variant="ghost" size="sm" href={`/project/${p.id}`}>
                {p.title}
              </AdvancedButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
