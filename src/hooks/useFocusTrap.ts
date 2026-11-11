"use client";
import { useEffect, useRef, useCallback } from "react";

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  active: boolean;
  /** Elements to exclude from inert (e.g., the panel itself) */
  excludeSelectors?: string[];
  /** Callback when focus trap is activated */
  onActivate?: () => void;
  /** Callback when focus trap is deactivated */
  onDeactivate?: () => void;
  /** Whether to restore focus to previously focused element on deactivate */
  restoreFocus?: boolean;
}

/**
 * Enhanced focus trap hook that properly handles:
 * - Tab cycling within the trapped element
 * - `inert` attribute on background content for accessibility
 * - Focus restoration on deactivation
 * - Nested focus traps (for modals within modals)
 *
 * @example
 * ```tsx
 * const focusTrapRef = useFocusTrap<HTMLDivElement>({
 *   active: isOpen,
 *   excludeSelectors: ['[data-focus-trap-exclude]'],
 * });
 *
 * return <div ref={focusTrapRef}>...</div>;
 * ```
 */
export function useFocusTrap<T extends HTMLElement>({
  active,
  excludeSelectors = [],
  onActivate,
  onDeactivate,
  restoreFocus = true,
}: UseFocusTrapOptions) {
  const ref = useRef<T | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const inertElements = useRef<HTMLElement[]>([]);
  const isNested = useRef(false);
  const wasActiveRef = useRef(false);

  // Build the exclude selector string
  const excludeSelector =
    excludeSelectors.length > 0
      ? `:not(${excludeSelectors.join("):not(")})`
      : "";

  const getFocusableElements = useCallback(() => {
    const root = ref.current;
    if (!root) return [];

    return Array.from(
      root.querySelectorAll<HTMLElement>(
        `a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [data-focusable]${excludeSelector}`,
      ),
    ).filter(
      (el) =>
        !el.hasAttribute("aria-hidden") &&
        el.offsetParent !== null && // visible
        !el.inert, // not already inert
    );
  }, [excludeSelector]);

  const applyInert = useCallback(
    (root: HTMLElement, activate: boolean) => {
      if (typeof document === "undefined") return;

      // Find all main content areas that should be inert
      // Exclude the root element and any elements with data-focus-trap-exclude
      const mainContent = document.querySelectorAll<HTMLElement>(
        'main, [role="main"], #main-content, .main-content, #content, .content',
      );

      if (activate) {
        // Store currently focused element
        previouslyFocused.current =
          document.activeElement as HTMLElement | null;

        // Apply inert to background content
        mainContent.forEach((el) => {
          if (
            el !== root &&
            !root.contains(el) &&
            !excludeSelectors.some((s) => el.matches(s))
          ) {
            el.setAttribute("inert", "");
            el.setAttribute("data-focus-trap-inert", "true");
            inertElements.current.push(el);
          }
        });

        // Also inert any sibling elements of root that aren't the root itself
        const parent = root.parentElement;
        if (parent) {
          Array.from(parent.children).forEach((child) => {
            if (child !== root && child instanceof HTMLElement) {
              child.setAttribute("inert", "");
              child.setAttribute("data-focus-trap-inert", "true");
              inertElements.current.push(child);
            }
          });
        }
      } else {
        // Remove inert from all elements we marked
        inertElements.current.forEach((el) => {
          el.removeAttribute("inert");
          el.removeAttribute("data-focus-trap-inert");
        });
        inertElements.current = [];
      }
    },
    [excludeSelectors],
  );

  useEffect(() => {
    // Activation keys off the `active` boolean's false→true edge — never off
    // mere identity changes of callbacks/refs between renders. Without this,
    // an inline `onActivate` would re-run the trap on every keystroke
    // and re-focus the first element (observed as: can't type in the input).
    const isFreshActivation = active && wasActiveRef.current === false;
    wasActiveRef.current = active;

    if (!active || !ref.current) return;
    if (!isFreshActivation) return;

    const root = ref.current;

    // Check if there's already an active focus trap (nested)
    isNested.current =
      document.querySelector('[data-focus-trap-active="true"]') !== null;

    // Mark this element as having an active focus trap
    root.setAttribute("data-focus-trap-active", "true");

    // Apply inert to background
    applyInert(root, true);

    const focusables = getFocusableElements();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const currentFocusables = getFocusableElements();
      if (currentFocusables.length === 0) return;

      const currentFirst = currentFocusables[0];
      const currentLast = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey && document.activeElement === currentFirst) {
        e.preventDefault();
        currentLast.focus();
      } else if (!e.shiftKey && document.activeElement === currentLast) {
        e.preventDefault();
        currentFirst.focus();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === "Escape") {
        // Don't prevent default here - let the component handle it
        // This allows components to customize Escape behavior
      }
      onKey(e);
    };

    root.addEventListener("keydown", onKeyDown);

    // Focus the first focusable element after a brief delay — but never
    // steal focus from something the user is already interacting with inside
    // the trap (otherwise re-runs re-focus the close button on every keystroke).
    const timeoutId = setTimeout(() => {
      const current = document.activeElement as HTMLElement | null;
      if (current && root.contains(current)) return;
      const elements = getFocusableElements();
      if (elements.length > 0) {
        elements[0].focus();
      }
    }, 0);

    onActivate?.();

    return () => {
      root.removeEventListener("keydown", onKeyDown);
      clearTimeout(timeoutId);

      // Remove the active marker
      root.removeAttribute("data-focus-trap-active");

      // Only remove inert if this is the outermost trap
      if (
        !isNested.current ||
        !document.querySelector('[data-focus-trap-active="true"]')
      ) {
        applyInert(root, false);
      }

      // Restore focus to previously focused element
      if (restoreFocus && previouslyFocused.current) {
        previouslyFocused.current.focus();
        previouslyFocused.current = null;
      }

      onDeactivate?.();
    };
  }, [
    active,
    applyInert,
    getFocusableElements,
    onActivate,
    onDeactivate,
    restoreFocus,
  ]);

  return ref;
}

/**
 * Hook for managing inert state on background content without full focus trap
 * Useful for side panels, drawers, etc. where you want to inert background
 * but not trap focus inside the panel
 */
export function useInertBackground({
  active,
  excludeSelectors = [],
}: {
  active: boolean;
  excludeSelectors?: string[];
}) {
  const inertElements = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const mainContent = document.querySelectorAll<HTMLElement>(
      'main, [role="main"], #main-content, .main-content, #content, .content',
    );

    if (active) {
      mainContent.forEach((el) => {
        if (!excludeSelectors.some((s) => el.matches(s))) {
          el.setAttribute("inert", "");
          el.setAttribute("data-inert-background", "true");
          inertElements.current.push(el);
        }
      });
    } else {
      inertElements.current.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("data-inert-background");
      });
      inertElements.current = [];
    }

    return () => {
      inertElements.current.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("data-inert-background");
      });
      inertElements.current = [];
    };
  }, [active, excludeSelectors]);
}

export default useFocusTrap;
