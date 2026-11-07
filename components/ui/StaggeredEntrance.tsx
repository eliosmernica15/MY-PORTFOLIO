'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { motionTokens, StaggerKey } from '@/lib/motion.tokens';

type StaggeredElementType = 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav' | 'span' | 'ul' | 'ol' | 'dl' | 'table' | 'tbody' | 'thead' | 'tfoot' | 'tr';

interface StaggeredEntranceProps {
  /** HTML element to render as the container */
  as?: StaggeredElementType;
  /** CSS class name for the container */
  className?: string;
  /** Stagger delay key from motionTokens.staggers */
  stagger?: StaggerKey;
  /** Custom stagger delay in seconds */
  staggerDelay?: number;
  /** Initial delay before first item animates */
  initialDelay?: number;
  /** Direction children animate from */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Distance in pixels for the initial offset */
  distance?: number;
  /** Child elements to stagger */
  children: React.ReactNode;
  /** Custom styles for the container */
  style?: React.CSSProperties;
  /** Whether to animate only once (default: true) */
  once?: boolean;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
  /** Threshold for IntersectionObserver */
  threshold?: number;
  /** Additional props passed to the container element */
  [key: string]: any;
}

/**
 * StaggeredEntrance - A container that staggers the entrance of its children
 * using IntersectionObserver for scroll-triggered animations.
 *
 * Features:
 * - Uses IntersectionObserver for performance
 * - Respects prefers-reduced-motion
 * - Supports multiple stagger directions
 * - Configurable delays and distances
 * - Only animates once by default
 *
 * @example
 * ```tsx
 * <StaggeredEntrance stagger="normal" direction="up">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </StaggeredEntrance>
 * ```
 */
export const StaggeredEntrance: React.FC<StaggeredEntranceProps> = ({
  as: Tag = 'div',
  className = '',
  stagger = 'normal',
  staggerDelay,
  initialDelay = 0.1,
  direction = 'up',
  distance = 20,
  children,
  style,
  once = true,
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.1,
  ...props
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // IntersectionObserver for scroll-triggered animation
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion, once, rootMargin, threshold]);

  // Calculate stagger delay
  const calculatedStaggerDelay = staggerDelay ?? motionTokens.staggers[stagger];

  // Generate initial state based on direction
  const getInitialState = () => {
    if (prefersReducedMotion) return { opacity: 1 };

    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  // Render children with staggered animations
  const childrenArray = React.Children.toArray(children);

  if (prefersReducedMotion) {
    return (
      <Tag
        ref={containerRef as any}
        className={className}
        style={style}
        {...props}
      >
        {childrenArray}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef as any}
      className={className}
      style={style}
      {...props}
    >
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        return (
          <motion.div
            key={child.key ?? index}
            initial={getInitialState()}
            animate={isVisible ? { opacity: 1, x: 0, y: 0 } : getInitialState()}
            transition={{
              delay: isVisible ? initialDelay + index * calculatedStaggerDelay : 0,
              duration: motionTokens.durations.normal / 1000,
              ease: motionTokens.easings.standard,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </Tag>
  );
};

/**
 * StaggeredItem - Individual item for use outside StaggeredEntrance
 * Useful when you need more control over individual items
 */
interface StaggeredItemProps extends HTMLMotionProps<'div'> {
  /** Animation delay in seconds */
  delay?: number;
  /** Animation direction */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Distance in pixels */
  distance?: number;
  /** Whether to use reduced motion */
  reducedMotion?: boolean;
}

export const StaggeredItem: React.FC<StaggeredItemProps> = ({
  delay = 0,
  direction = 'up',
  distance = 20,
  reducedMotion = false,
  children,
  style,
  className,
  ...props
}) => {
  const getInitialState = () => {
    if (reducedMotion) return { opacity: 1 };

    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  return (
    <motion.div
      initial={getInitialState()}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        delay,
        duration: motionTokens.durations.normal / 1000,
        ease: motionTokens.easings.standard,
      }}
      style={style}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggeredList - Convenience component for lists of items
 */
interface StaggeredListProps {
  /** Array of items to render */
  items: React.ReactNode[];
  /** Render function for each item */
  renderItem: (item: React.ReactNode, index: number) => React.ReactElement;
  /** Stagger configuration */
  stagger?: StaggerKey;
  /** Custom stagger delay */
  staggerDelay?: number;
  /** Initial delay */
  initialDelay?: number;
  /** Direction */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Distance */
  distance?: number;
  /** Container element */
  as?: keyof React.JSX.IntrinsicElements;
  /** Container className */
  className?: string;
  /** Once only */
  once?: boolean;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  renderItem,
  stagger = 'normal',
  staggerDelay,
  initialDelay = 0.1,
  direction = 'up',
  distance = 20,
  as: Tag = 'div',
  className = '',
  once = true,
}) => {
  const calculatedStaggerDelay = staggerDelay ?? motionTokens.staggers[stagger];

  return (
    <Tag className={className}>
      {items.map((item, index) => (
        <StaggeredItem
          key={index}
          delay={initialDelay + index * calculatedStaggerDelay}
          direction={direction}
          distance={distance}
        >
          {renderItem(item, index)}
        </StaggeredItem>
      ))}
    </Tag>
  );
};

export default StaggeredEntrance;