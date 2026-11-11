"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Square, X } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";
import { useOs, type AppId } from "./OsContext";
import { OS_APPS } from "./registry";

/**
 * ELIOS/OS window chrome.
 *
 * Desktop (≥768px): draggable, modeless dialog, viewport-clamped.
 * Mobile: full-screen sheet with focus trap semantics (aria-modal) —
 * the desktop-chrome controls collapse to close-only.
 */

const MENUBAR_PX = 48;
const VIEWPORT_MARGIN = 10;

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

const Window: React.FC<{ appId: AppId }> = ({ appId }) => {
  const t = useT();
  const os = useOs();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const meta = OS_APPS[appId];
  const win = os.windows.find((w) => w.appId === appId);
  const focused = os.focused === appId;

  const viewport = () => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1280,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  // Initial cascaded position (centered, offset per open order).
  const [pos, setPos] = useState(() => {
    const { w: vw, h: vh } = viewport();
    const width = Math.min(meta.size.width, vw - VIEWPORT_MARGIN * 2);
    const height = Math.min(
      meta.size.height,
      vh - MENUBAR_PX - VIEWPORT_MARGIN,
    );
    const cascade = ((win?.openIndex ?? 1) - 1) % 5;
    return {
      x: Math.max(
        VIEWPORT_MARGIN,
        Math.round((vw - width) / 2) + cascade * 32 - 64,
      ),
      y: Math.max(
        MENUBAR_PX + 8,
        Math.round((vh - height) / 2 - 24) + cascade * 28 - 56,
      ),
      width,
      height,
    };
  });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Keep the window inside the viewport on resize.
  useEffect(() => {
    const onResize = () => {
      const { w: vw, h: vh } = viewport();
      setPos((p) => ({
        ...p,
        width: Math.min(
          Math.max(p.width, meta.minSize.width),
          vw - VIEWPORT_MARGIN * 2,
        ),
        x: Math.min(
          Math.max(VIEWPORT_MARGIN, p.x),
          Math.max(VIEWPORT_MARGIN, vw - VIEWPORT_MARGIN - p.width),
        ),
        y: Math.min(
          Math.max(MENUBAR_PX + 4, p.y),
          Math.max(MENUBAR_PX + 4, vh - 80),
        ),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [meta.minSize.width]);

  // Focus the window body when it opens (mount) — not on every refocus.
  useLayoutEffect(() => {
    windowRef.current?.focus({ preventScroll: true });
  }, []);

  const onPointerDownTitle = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isMobile || win?.maximized) return;
      // Ignore drags that start on control buttons.
      if ((event.target as HTMLElement).closest("[data-window-control]"))
        return;
      const pointer = event.pointerId;
      (event.currentTarget as HTMLDivElement).setPointerCapture(pointer);
      dragRef.current = {
        dx: event.clientX - pos.x,
        dy: event.clientY - pos.y,
      };
    },
    [isMobile, win?.maximized, pos.x, pos.y],
  );

  const onPointerMoveTitle = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const { w: vw, h: vh } = viewport();
      const nextX = Math.min(
        Math.max(VIEWPORT_MARGIN, event.clientX - dragRef.current.dx),
        Math.max(VIEWPORT_MARGIN, vw - VIEWPORT_MARGIN - pos.width),
      );
      const nextY = Math.min(
        Math.max(MENUBAR_PX + 4, event.clientY - dragRef.current.dy),
        Math.max(MENUBAR_PX + 4, vh - 72),
      );
      setPos((p) => ({ ...p, x: nextX, y: nextY }));
    },
    [pos.width],
  );

  const onPointerUpTitle = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = null;
      try {
        (event.currentTarget as HTMLDivElement).releasePointerCapture(
          event.pointerId,
        );
      } catch {
        /* already released */
      }
    },
    [],
  );

  if (!win) return null;
  if (win.minimized) {
    return (
      <div
        hidden
        role="dialog"
        aria-hidden="true"
        aria-label={t(meta.nameKey)}
      />
    );
  }

  const maximized = win.maximized && !isMobile;
  const title = t(meta.nameKey);
  const Icon = meta.icon;

  const frameStyle: React.CSSProperties = maximized
    ? {
        position: "fixed",
        top: `${MENUBAR_PX}px`,
        left: 0,
        right: 0,
        bottom: 0,
        width: "auto",
        height: "auto",
        zIndex: win.z,
      }
    : isMobile
      ? {
          position: "fixed",
          inset: 0,
          width: "auto",
          height: "auto",
          zIndex: win.z,
        }
      : {
          position: "fixed",
          top: 0,
          left: 0,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          zIndex: win.z,
        };

  return (
    <motion.div
      ref={windowRef}
      role="dialog"
      aria-modal={isMobile ? "true" : undefined}
      aria-label={title}
      tabIndex={-1}
      initial={
        prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.97 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto flex flex-col overflow-hidden border outline-none focus:outline-none ${
        maximized || isMobile ? "rounded-none" : "rounded-xl"
      }`}
      style={{
        ...frameStyle,
        borderColor: focused ? "var(--border-hover)" : "var(--border)",
        background: "var(--bg-card)",
        backdropFilter: "blur(18px) saturate(1.05)",
        WebkitBackdropFilter: "blur(18px) saturate(1.05)",
        boxShadow: focused
          ? "0 28px 80px rgba(0,0,0,0.45)"
          : "0 14px 44px rgba(0,0,0,0.28)",
      }}
      onPointerDown={() => {
        if (!focused) os.focus(appId);
      }}
    >
      {/* Title bar */}
      <div
        className="flex h-10 sm:h-11 shrink-0 select-none items-center gap-2 border-b pl-3 pr-2"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface-elevated)",
          touchAction: "none",
          cursor: maximized || isMobile ? "default" : "grab",
        }}
        onPointerDown={onPointerDownTitle}
        onPointerMove={onPointerMoveTitle}
        onPointerUp={onPointerUpTitle}
        onPointerCancel={onPointerUpTitle}
      >
        <Icon
          size={15}
          strokeWidth={2}
          aria-hidden
          className="shrink-0 text-[var(--text-muted)]"
        />
        <span className="min-w-0 flex-1 truncate font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[var(--text-secondary)]">
          {title}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            data-window-control
            onClick={() => os.toggleMinimize(appId)}
            aria-label={t("os.minimizeWindow")}
            title={t("os.minimizeWindow")}
            className="window-control"
          >
            <Minus size={13} strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            data-window-control
            onClick={() => os.toggleMaximize(appId)}
            aria-label={
              win.maximized ? t("os.restoreWindow") : t("os.maximizeWindow")
            }
            title={
              win.maximized ? t("os.restoreWindow") : t("os.maximizeWindow")
            }
            className="window-control hidden sm:inline-flex"
          >
            <Square size={11} strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            data-window-control
            onClick={() => os.close(appId)}
            aria-label={t("os.closeWindow")}
            title={t("os.closeWindow")}
            className="window-control window-control-close"
          >
            <X size={14} strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-auto">
        {(() => {
          const Body = meta.component;
          return (
            <React.Suspense
              fallback={
                <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  {t("os.loadingApp")}
                </div>
              }
            >
              <Body />
            </React.Suspense>
          );
        })()}
      </div>
    </motion.div>
  );
};

export default Window;
