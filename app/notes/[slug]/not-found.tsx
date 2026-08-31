import Link from 'next/link';

export default function NoteNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: 'var(--accent-light)' }}>
          Note not found
        </p>
        <h1 className="text-4xl font-black">No note here.</h1>
        <Link href="/notes" className="btn-enterprise btn-enterprise-md btn-enterprise-primary">
          Back to all notes
        </Link>
      </div>
    </div>
  );
}
