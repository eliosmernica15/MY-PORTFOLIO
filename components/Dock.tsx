"use client";

import React, { memo, useCallback } from "react";
import Link from "next/link";
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
import { SITE } from "@/data/site";

/**
 * ELIOS/OS Dock — fixed bottom application bar.
 *
 * Every icon performs a real function:
 *  - Finder    → scrolls to #projects
 *  - Terminal  → toggles the actual terminal widget (custom event)
 *  - Notes     → scrolls to #notes
 *  - Preview   → navigates to the featured case study (/project/apl)
 *  - About     → scrolls to #about
 *  - Prefs     → scrolls to #services
 *  - Mail      → scrolls to #contact
 *  - Hire Me   → opens the visitor's mail client to SITE.email
 *
 * Windowed applications arrive in the next stage; in the meantime every
 * control is honest and functional.
 */

type DockAction =
  | { type: "scroll"; id: string }
  | { type: "terminal" }
  | { type: "link"; href: string }
  | { type: "mailto" };

const APPS: { key: string; icon: React.ElementType; action: DockAction }[] = [
  { key: "finder", icon: Folder, action: { type: "scroll", id: "projects" } },
  { key: "terminal", icon: SquareTerminal, action: { type: "terminal" } },
  { key: "notes", icon: FileText, action: { type: "scroll", id: "notes" } },
  {
    key: "preview",
    icon: Images,
    action: { type: "link", href: "/project/apl" },
  },
  {
    key: "about",
    icon: CircleUserRound,
    action: { type: "scroll", id: "about" },
  },
  {
    key: "preferences",
    icon: Settings,
    action: { type: "scroll", id: "services" },
  },
  { key: "mail", icon: Mail, action: { type: "scroll", id: "contact" } },
];

const HIRE_ME_MAILTO = `mailto:${SITE.email}?subject=${encodeURIComponent(
  "Project inquiry — via eliosmernica.vercel.app",
)}`;

const DockItem: React.FC<{
  name: string;
  hint: string;
  actionLabel: string;
  icon: React.ElementType;
  action: DockAction;
  onAction: (action: DockAction) => void;
  elevated?: boolean;
}> = ({ name, hint, actionLabel, icon: Icon, action, onAction, elevated }) => {
  const content = (
    <>
      <span className={`dock-tile ${elevated ? "dock-tile-elevated" : ""}`}>
        <Icon size={20} strokeWidth={1.75} aria-hidden />
      </span>
      <span aria-hidden className="dock-tooltip">
        {name} · {hint}
      </span>
    </>
  );

  const common = {
    className: "dock-app group interactive-btn",
    "aria-label": actionLabel,
  } as const;

  if (action.type === "link") {
    return (
      <Link {...common} href={action.href} prefetch={false}>
        {content}
      </Link>
    );
  }
  if (action.type === "mailto") {
    return (
      <a {...common} href={HIRE_ME_MAILTO}>
        {content}
      </a>
    );
  }
  return (
    <button {...common} type="button" onClick={() => onAction(action)}>
      {content}
    </button>
  );
};

const Dock: React.FC = () => {
  const t = useT();

  const run = useCallback((action: DockAction) => {
    switch (action.type) {
      case "scroll":
        document
          .getElementById(action.id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "terminal":
        window.dispatchEvent(new CustomEvent("elios:terminal-toggle"));
        break;
      case "mailto":
        window.location.href = HIRE_ME_MAILTO;
        break;
      default:
        break;
    }
  }, []);

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
            onAction={run}
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
          action={{ type: "mailto" }}
          onAction={run}
          elevated
        />
      </div>
    </nav>
  );
};

export default memo(Dock);
