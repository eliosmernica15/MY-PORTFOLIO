/**
 * Motion Tokens Design System
 *
 * A semantic token system for animations that replaces hardcoded
 * Framer Motion variants. All animations reference these tokens
 * for consistency and easy theming.
 *
 * Usage:
 *   import { motionTokens } from '@/lib/motion.tokens';
 *   <motion.div animate={motionTokens.entrance} />
 */

import { Variants } from 'framer-motion';

// ============================================================
// Easing Functions
// ============================================================

export const easings = {
  /** Standard entrance/exit easing - smooth, natural */
  standard: [0.22, 1, 0.36, 1] as const,

  /** Quick, snappy interactions (buttons, toggles) */
  snappy: [0.33, 1, 0.68, 1] as const,

  /** Gentle, relaxed motion (modals, drawers) */
  gentle: [0.25, 0.46, 0.45, 0.94] as const,

  /** Sharp, decisive motion (alerts, errors) */
  sharp: [0.55, 0.055, 0.675, 0.19] as const,

  /** Spring physics for natural feeling */
  spring: { type: 'spring', stiffness: 500, damping: 28 } as const,

  /** Soft spring for gentle movements */
  springSoft: { type: 'spring', stiffness: 300, damping: 20 } as const,

  /** Bouncy spring for delightful interactions */
  springBouncy: { type: 'spring', stiffness: 400, damping: 18 } as const,
};

// ============================================================
// Duration Tokens (ms)
// ============================================================

export const durations = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
  slowest: 1000,
} as const;

// ============================================================
// Stagger Tokens
// ============================================================

export const staggers = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.12,
  section: 0.16,
} as const;

// ============================================================
// Core Animation Variants
// ============================================================

/**
 * Entrance animations - elements appearing on screen
 */
export const entrance: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * Fade entrance - minimal movement, just opacity
 */
export const fadeEntrance: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * Slide up entrance - for content rising into view
 */
export const slideUpEntrance: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * Slide down entrance - for dropdowns, modals from top
 */
export const slideDownEntrance: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Scale entrance - for modals, popovers, cards
 */
export const scaleEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 28,
      duration: durations.fast / 1000,
    },
  },
};

/**
 * Exit animations - elements leaving screen
 */
export const exit: Variants = {
  visible: { opacity: 1, y: 0 },
  hidden: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Fade exit - minimal movement
 */
export const fadeExit: Variants = {
  visible: { opacity: 1 },
  hidden: {
    opacity: 0,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.standard,
    },
  },
};

// ============================================================
// Interaction Variants
// ============================================================

/**
 * Hover state - subtle lift and shadow
 */
export const hover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Subtle hover - just scale
 */
export const hoverSubtle: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.01,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Tap/press state - immediate feedback
 */
export const tap: Variants = {
  rest: { scale: 1 },
  tap: {
    scale: 0.98,
    transition: {
      duration: durations.instant / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * Focus state - visible ring
 */
export const focus: Variants = {
  rest: { boxShadow: 'none' },
  focus: {
    boxShadow: '0 0 0 3px var(--ring-focus)',
    transition: {
      duration: durations.fast / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * Drag state - for draggable elements
 */
export const drag: Variants = {
  rest: { scale: 1, boxShadow: 'var(--shadow-accent)' },
  drag: {
    scale: 1.02,
    boxShadow: '0 12px 40px var(--shadow-accent)',
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

// ============================================================
// Complex Component Variants
// ============================================================

/**
 * Modal/dialog variants
 */
export const modal: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 28,
      duration: durations.normal / 1000,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Side panel/drawer variants (Terminal, Assistant)
 */
export const sidePanel: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 28,
      duration: durations.normal / 1000,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Panel from left (Terminal)
 */
export const sidePanelLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 28,
      duration: durations.normal / 1000,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Minimized panel state
 */
export const panelMinimized: Variants = {
  open: { height: 'auto', opacity: 1 },
  minimized: {
    height: 44,
    opacity: 1,
    transition: {
      duration: durations.normal / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * Card hover with 3D tilt
 */
export const cardTilt: Variants = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: {
    rotateX: 0,
    rotateY: 0,
    scale: 1.01,
    transition: {
      duration: durations.normal / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * Staggered children container
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggers.normal,
      delayChildren: 0.1,
    },
  },
};

/**
 * Staggered child item
 */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal / 1000,
      ease: easings.standard,
    },
  },
};

/**
 * List item staggered
 */
export const listStagger: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * staggers.tight,
      duration: durations.normal / 1000,
      ease: easings.standard,
    },
  }),
};

// ============================================================
// Page Transition Variants (for View Transitions API)
// ============================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow / 1000,
      ease: easings.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.fast / 1000,
      ease: easings.snappy,
    },
  },
};

/**
 * Shared layout transition for project cards -> detail page
 */
export const projectCardLayout: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal / 1000,
      ease: easings.standard,
    },
  },
};

// ============================================================
// Reduced Motion Variants
// ============================================================

/**
 * Creates reduced-motion variants from any variant object
 * Disables all animations while preserving final states
 */
export function createReducedMotionVariants<T extends Variants>(
  variants: T
): T {
  const reduced: Record<string, any> = {};

  for (const [key, variant] of Object.entries(variants)) {
    if (typeof variant === 'object' && variant !== null) {
      reduced[key] = {
        ...variant,
        transition: { duration: 0 },
      };
    } else {
      reduced[key] = variant;
    }
  }

  return reduced as T;
}

/**
 * Pre-built reduced motion variants for common patterns
 */
export const reducedMotion = {
  entrance: createReducedMotionVariants(entrance),
  exit: createReducedMotionVariants(exit),
  hover: createReducedMotionVariants(hover),
  tap: createReducedMotionVariants(tap),
  modal: createReducedMotionVariants(modal),
  sidePanel: createReducedMotionVariants(sidePanel),
  staggerContainer: createReducedMotionVariants(staggerContainer),
  staggerChild: createReducedMotionVariants(staggerChild),
};

// ============================================================
// Export All Tokens
// ============================================================

export const motionTokens = {
  easings,
  durations,
  staggers,
  entrance,
  fadeEntrance,
  slideUpEntrance,
  slideDownEntrance,
  scaleEntrance,
  exit,
  fadeExit,
  hover,
  hoverSubtle,
  tap,
  focus,
  drag,
  modal,
  sidePanel,
  sidePanelLeft,
  panelMinimized,
  cardTilt,
  staggerContainer,
  staggerChild,
  listStagger,
  pageTransition,
  projectCardLayout,
  reducedMotion,
  createReducedMotionVariants,
} as const;

// Type helpers
export type MotionTokenKey = keyof typeof motionTokens;
export type EasingKey = keyof typeof easings;
export type DurationKey = keyof typeof durations;
export type StaggerKey = keyof typeof staggers;