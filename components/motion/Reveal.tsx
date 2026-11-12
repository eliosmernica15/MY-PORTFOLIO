"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealVariant = "rise" | "fade" | "clip" | "slide" | "mask";

interface RevealProps {
  as?: keyof React.JSX.IntrinsicElements;
  variant?: RevealVariant;
  delay?: number; // ms
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * IntersectionObserver-based reveal. Adds `is-visible` once the element
 * enters the viewport; CSS in globals.css owns the transition. Content is
 * never hidden from crawlers/no-JS: without the `js` class on <html> (set by
 * the layout's inline bootstrap) or with reduced motion, everything renders
 * fully visible.
 */
export function Reveal({
  as = "div",
  variant = "rise",
  delay = 0,
  className,
  children,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = as as React.ElementType;
  const classes = [
    "reveal",
    `reveal-${variant}`,
    visible ? "is-visible" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle = {
    ...style,
    "--reveal-delay": `${delay}ms`,
  } as React.CSSProperties;

  if (variant === "mask") {
    return (
      <Component
        ref={ref as React.Ref<any>}
        className={classes}
        style={mergedStyle}
      >
        <span className="reveal-mask-inner">{children}</span>
      </Component>
    );
  }

  if (variant === "clip") {
    // IMPORTANT: the observed box must carry NO clip-path — a clip-path on
    // the target collapses its IntersectionObserver rect to zero and the
    // reveal would never fire. The clip lives on the inner wrapper instead.
    return (
      <Component
        ref={ref as React.Ref<any>}
        className={classes}
        style={mergedStyle}
      >
        <span className="reveal-clip-inner">{children}</span>
      </Component>
    );
  }

  return (
    <Component
      ref={ref as React.Ref<any>}
      className={classes}
      style={mergedStyle}
    >
      {children}
    </Component>
  );
}
