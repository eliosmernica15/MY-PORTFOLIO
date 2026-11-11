"use client";

import React, { memo, useCallback } from "react";
import {
  Folder,
  SquareTerminal,
  FileText,
  Images,
  CircleUserRound,
  Settings,
  Mail,
  Briefcase,
} from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";
import { useOs, type AppId } from "./os/OsContext";

/**
 * ELIOS/OS Dock — the running application bar.
 * Every icon launches its application window (Terminal toggles the
 * terminal widget). Running apps show an indicator dot; clicking a
 * focused app minimizes it, clicking again restores it.
 *
 * Mobile: horizontally scrollable, no overflow.
 */

type DockAction = { type: "app"; appId: AppId } | { type: "terminal" };

const APPS: { key: string; icon: React.ElementType; action: DockAction }[] = [
  { key: "finder", icon: Folder, action: { type: "app", appId: "finder" } },
  { key: "terminal", icon: SquareTerminal, action: { type: "terminal" } },
  { key: "notes", icon: FileText, action: { type: "app", appId: "notes" } },
  { key: "preview", icon: Images, action: { type: "app", appId: "preview" } },
  {
    key: "about",
    icon: CircleUserRound,
    action: { type: "app", appId: "about" },
  },
  {
    key: "preferences",
    icon: Settings,
    action: { type: "app", appId: "preferences" },
  },
  { key: "mail", icon: Mail, action: { type: "app", appId: "mail" } },
];

const DockItem: React.FC<{
  name: string;
  hint: string;
  actionLabel: string;
  icon: React.ElementType;
  action: DockAction;
  elevated?: boolean;
}> = ({ name, hint, actionLabel, icon: Icon, action, elevated }) => {
  const os = useOs();
  const running = action.type === "app" && os.isOpen(action.appId);
  const minimized = action.type === "app" && os.isMinimized(action.appId);
  const focused = action.type === "app" && os.focused === action.appId;

  const onClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      const opener = ev.currentTarget;
      if (action.type === "terminal") {
        window.dispatchEvent(new CustomEvent("elios:terminal-toggle"));
        return;
      }
      if (running && focused && !minimized) {
        os.toggleMinimize(action.appId);
        return;
      }
      os.open(action.appId, opener);
    },
    [action, running, focused, minimized, os],
  );

  return (
    <button
      type="button"
      aria-label={actionLabel}
      aria-pressed={focused}
      onClick={onClick}
      className="dock-app group interactive-btn"
    >
      <span className={`dock-tile ${elevated ? "dock-tile-elevated" : ""}`}>
        <Icon size={20} strokeWidth={1.75} aria-hidden />
        {running && (
          <span
            aria-hidden
            className="dock-running-dot"
            style={{ opacity: minimized ? 0.35 : 1 }}
          />
        )}
      </span>
      <span aria-hidden className="dock-tooltip">
        {name} · {hint}
      </span>
    </button>
  );
};

const Dock: React.FC = () => {
  const t = useT();

  const label = (key: string) => ({
    name: t(`dock.${key}`),
    hint: t(`dock.${key}Hint`),
    actionLabel: t("dock.launchApp", { app: t(`dock.${key}`) }),
  });

  return (
    <nav
      aria-label={t("desktop.mastheadTag")}
      className="fixed bottom-3 sm:bottom-5 left-1/2 z-40 -translate-x-1/2 max-w-[calc(100vw-0.75rem)]"
    >
      <div
        className="flex items-center gap-1 sm:gap-1.5 rounded-2xl border px-2 sm:px-3 py-2 sm:py-2.5 backdrop-blur-xl overflow-x-auto no-scrollbar"
        style={{
          borderColor: "var(--border-hover)",
          background: "var(--hero-card-bg)",
        }}
      >
        {APPS.map((app) => (
          <DockItem
            key={app.key}
            {...label(app.key)}
            icon={app.icon}
            action={app.action}
          />
        ))}
        <span
          aria-hidden
          className="mx-0.5 sm:mx-1 h-8 sm:h-10 w-px"
          style={{ background: "var(--border-hover)" }}
        />
        <DockItem
          {...label("hireMe")}
          icon={Briefcase}
          action={{ type: "app", appId: "hire" }}
          elevated
        />
      </div>
    </nav>
  );
};

export default memo(Dock);
