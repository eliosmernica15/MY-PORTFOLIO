'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Display name for the error boundary (for debugging) */
  displayName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 *
 * Features:
 * - Catches render errors, lifecycle errors, and constructor errors
 * - Logs errors to console in development
 * - Calls optional onError callback for error reporting (Sentry, etc.)
 * - Provides a default fallback UI that matches the design system
 * - Can be customized with custom fallback UI
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={<div>Something went wrong</div>}
 *   onError={(error, info) => logErrorToSentry(error, info)}
 * >
 *   <Terminal />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ErrorBoundary: ${this.props.displayName || 'Unknown'}]`, error, errorInfo);
    }

    // Call optional error callback for external reporting
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="flex flex-col items-center justify-center p-8 text-center"
          style={{
            color: 'var(--text-secondary)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
          }}
          role="alert"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Something went wrong
          </h3>
          <p className="text-sm mb-4 max-w-sm">
            This component encountered an error. The rest of the page should still work.
          </p>
          <details className="text-left w-full max-w-md">
            <summary
              className="text-xs font-mono cursor-pointer mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Error details (development only)
            </summary>
            <pre
              className="text-[10px] p-3 overflow-auto max-h-48 rounded"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              {this.state.error?.message}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-contrast)',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight error boundary for inline elements that shouldn't
 * break the layout when they error.
 */
export class InlineErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  public state = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[InlineErrorBoundary]', error, errorInfo);
    }
    this.props.onError?.(error);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{
            background: 'var(--accent-muted)',
            color: 'var(--accent)',
            border: '1px solid var(--border)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Unavailable
        </span>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to check if an error boundary caught an error in the parent tree.
 * Useful for conditionally rendering content based on error state.
 */
export function useErrorBoundary(): boolean {
  // This is a placeholder - React doesn't provide a built-in way to
  // detect parent error boundaries. In practice, you'd use context.
  return false;
}

export default ErrorBoundary;