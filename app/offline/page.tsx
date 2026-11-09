import type { Metadata } from "next";
import Link from "next/link";
import Brand from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "You're offline",
  description:
    "This page is available offline. Everything else needs a connection.",
  robots: { index: false, follow: false },
};

// NOTE: keep this page dependency-free and static - the service worker
// (public/sw.js) precaches /offline and must be able to serve it with no
// network access. No client-side fetching, no external fonts.
export default function OfflinePage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Brand size={48} />
        </div>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.4em]"
          style={{ color: "var(--accent-light)" }}
        >
          No connection
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          You&rsquo;re offline.
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          The page you asked for isn&rsquo;t cached yet. Check your connection
          and try again - the home page works offline once it has loaded once.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
          style={{
            background: "var(--accent-color, #3b82f6)",
            color: "#000",
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
