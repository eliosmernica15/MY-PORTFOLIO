"use client";

import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import {
  Folder,
  Images,
  FileText,
  CircleUserRound,
  Settings,
  Mail,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import type { AppId } from "./OsContext";

/**
 * ELIOS/OS application registry.
 * Window titles reuse the dock.* i18n keys so an app has one canonical name.
 * Components are lazy — window code is only fetched when an app is first
 * opened, keeping the base shell light.
 */
export interface AppDefinition {
  nameKey: string;
  icon: LucideIcon;
  component: LazyExoticComponent<ComponentType>;
  /** Preferred desktop size (px). Mobile always renders a fullscreen sheet. */
  size: { width: number; height: number };
  /** Minimum sensible size to prevent unreadable windows. */
  minSize: { width: number; height: number };
}

export const OS_APPS: Record<AppId, AppDefinition> = {
  finder: {
    nameKey: "dock.finder",
    icon: Folder,
    component: lazy(() => import("./apps/FinderApp")),
    size: { width: 940, height: 600 },
    minSize: { width: 560, height: 420 },
  },
  preview: {
    nameKey: "dock.preview",
    icon: Images,
    component: lazy(() => import("./apps/PreviewApp")),
    size: { width: 880, height: 640 },
    minSize: { width: 540, height: 440 },
  },
  notes: {
    nameKey: "dock.notes",
    icon: FileText,
    component: lazy(() => import("./apps/NotesApp")),
    size: { width: 760, height: 620 },
    minSize: { width: 420, height: 380 },
  },
  about: {
    nameKey: "dock.about",
    icon: CircleUserRound,
    component: lazy(() => import("./apps/AboutApp")),
    size: { width: 860, height: 640 },
    minSize: { width: 480, height: 420 },
  },
  preferences: {
    nameKey: "dock.preferences",
    icon: Settings,
    component: lazy(() => import("./apps/PreferencesApp")),
    size: { width: 860, height: 620 },
    minSize: { width: 480, height: 400 },
  },
  mail: {
    nameKey: "dock.mail",
    icon: Mail,
    component: lazy(() => import("./apps/MailApp")),
    size: { width: 560, height: 560 },
    minSize: { width: 340, height: 420 },
  },
  hire: {
    nameKey: "dock.hireMe",
    icon: Briefcase,
    component: lazy(() => import("./apps/HireMeApp")),
    size: { width: 600, height: 640 },
    minSize: { width: 340, height: 440 },
  },
};
