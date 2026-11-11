"use client";

import { useEffect } from "react";
import { AdvancedButton } from "@/components/ui/AdvancedButton";
import Brand from "@/components/ui/Brand";
import { useT } from "@/i18n/LocaleProvider";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    if (typeof console !== "undefined") console.error(error);
  }, [error]);

  return (
    <div
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
          {t("errors.unexpected")}
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          {t("errors.somethingBroke")}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {t("errors.unrecoverable")}
        </p>
        {error.digest && (
          <p
            className="text-[10px] font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <AdvancedButton variant="primary" onClick={reset}>
            {t("errors.retry")}
          </AdvancedButton>
          <AdvancedButton variant="secondary" href="/">
            {t("errors.backHome")}
          </AdvancedButton>
        </div>
      </div>
    </div>
  );
}
