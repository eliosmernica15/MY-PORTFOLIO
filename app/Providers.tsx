"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeProvider";
import Terminal from "@/components/Terminal";
import AssistantChat from "@/components/AssistantChat";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: "en" | "sq";
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <ThemeProvider>
        {children}
        {/* Signature features — available on every page. */}
        <ErrorBoundary
          displayName="Terminal"
          fallback={
            <div
              className="fixed left-4 bottom-4 z-[60]"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                  width: "200px",
                }}
              >
                Terminal unavailable
              </div>
            </div>
          }
        >
          <Terminal />
        </ErrorBoundary>
        <ErrorBoundary
          displayName="AssistantChat"
          fallback={
            <div
              className="fixed right-4 bottom-4 z-[60]"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                  width: "200px",
                }}
              >
                Assistant unavailable
              </div>
            </div>
          }
        >
          <AssistantChat />
        </ErrorBoundary>
      </ThemeProvider>
    </LocaleProvider>
  );
}
