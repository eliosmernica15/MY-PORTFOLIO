"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * ELIOS/OS window manager.
 *
 * Single instance per application (quick-switch model): each app has at
 * most one window. Tracks open windows, z-order (monotonic counter), and
 * minimized/maximized state. Closing a window returns focus to the element
 * that opened it (dock button, palette entry, …) or to the next topmost
 * window; focus then stays coherent via the sync effect below.
 */

export type AppId =
  "finder" | "preview" | "notes" | "about" | "preferences" | "mail" | "hire";

export interface WindowState {
  appId: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  openIndex: number;
}

interface OsContextValue {
  windows: WindowState[];
  focused: AppId | null;
  /** Open (or re-focus) an app window. `opener` is used to restore focus on close. */
  open: (appId: AppId, opener?: HTMLElement | null) => void;
  close: (appId: AppId) => void;
  toggleMinimize: (appId: AppId) => void;
  toggleMaximize: (appId: AppId) => void;
  focus: (appId: AppId) => void;
  isOpen: (appId: AppId) => boolean;
  isMinimized: (appId: AppId) => boolean;
}

const OsContext = createContext<OsContextValue | null>(null);

export function OsProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focused, setFocused] = useState<AppId | null>(null);
  const zCounter = useRef(10);
  const openCounter = useRef(0);
  const lastOpener = useRef<HTMLElement | null>(null);

  const focus = useCallback((appId: AppId) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) =>
      prev.map((w) => (w.appId === appId ? { ...w, z, minimized: false } : w)),
    );
    setFocused(appId);
  }, []);

  const open = useCallback((appId: AppId, opener?: HTMLElement | null) => {
    if (opener) lastOpener.current = opener;
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId);
      if (existing) {
        return prev.map((w) =>
          w.appId === appId ? { ...w, z, minimized: false } : w,
        );
      }
      openCounter.current += 1;
      return [
        ...prev,
        {
          appId,
          z,
          minimized: false,
          maximized: false,
          openIndex: openCounter.current,
        },
      ];
    });
    setFocused(appId);
  }, []);

  const close = useCallback((appId: AppId) => {
    setWindows((prev) => prev.filter((w) => w.appId !== appId));
    const opener = lastOpener.current;
    window.setTimeout(() => {
      if (opener && document.contains(opener)) opener.focus();
    }, 0);
  }, []);

  const toggleMinimize = useCallback((appId: AppId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.appId === appId ? { ...w, minimized: !w.minimized } : w,
      ),
    );
  }, []);

  const toggleMaximize = useCallback((appId: AppId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.appId === appId ? { ...w, maximized: !w.maximized } : w,
      ),
    );
  }, []);

  // Keep `focused` pointing at a visible (non-minimized) window: when the
  // focused window closes or minimizes, promote the next topmost one.
  useEffect(() => {
    if (
      focused !== null &&
      windows.some((w) => w.appId === focused && !w.minimized)
    )
      return;
    const top = [...windows]
      .filter((w) => !w.minimized)
      .sort((a, b) => b.z - a.z)[0];
    setFocused(top ? top.appId : null);
  }, [windows, focused]);

  // Esc closes the focused window (transient layers like the palette own
  // their own Esc; ⌘W/Ctrl+W stay browser-native).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key !== "Escape" ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey
      )
        return;
      if (focused) close(focused);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, close]);

  const isOpen = useCallback(
    (appId: AppId) => windows.some((w) => w.appId === appId),
    [windows],
  );
  const isMinimized = useCallback(
    (appId: AppId) =>
      windows.find((w) => w.appId === appId)?.minimized ?? false,
    [windows],
  );

  const value = useMemo<OsContextValue>(
    () => ({
      windows,
      focused,
      open,
      close,
      toggleMinimize,
      toggleMaximize,
      focus,
      isOpen,
      isMinimized,
    }),
    [
      windows,
      focused,
      open,
      close,
      toggleMinimize,
      toggleMaximize,
      focus,
      isOpen,
      isMinimized,
    ],
  );

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs(): OsContextValue {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used within <OsProvider>");
  return ctx;
}
