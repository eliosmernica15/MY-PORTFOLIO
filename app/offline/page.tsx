"use client";

import type { Metadata } from "next";
import Link from "next/link";
import Brand from "@/components/ui/Brand";
import { useT } from "@/i18n/LocaleProvider";

const OfflinePage = () => {
  const t = useT();

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
          {t("errors.offlineTitle")}
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          {t("errors.offlineHeading")}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {t("errors.offlineDescription")}
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
          {t("errors.goHome")}
        </Link>
      </div>
    </main>
  );
};

export default OfflinePage;
