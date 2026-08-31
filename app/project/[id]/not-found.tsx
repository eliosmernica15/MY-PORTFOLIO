import Link from 'next/link';
import { AdvancedButton } from '@/components/ui/AdvancedButton';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: 'var(--accent-light)' }}>
          Project not found
        </p>
        <h1 className="text-4xl font-black">No case study here.</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The project you’re looking for may have been renamed or removed.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/#projects" className="btn-enterprise btn-enterprise-md btn-enterprise-primary">
            View all projects
          </Link>
          <AdvancedButton variant="secondary" href="/">
            Back home
          </AdvancedButton>
        </div>
      </div>
    </div>
  );
}
