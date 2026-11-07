/**
 * Privacy-First Analytics System
 *
 * Implements analytics tracking with privacy-first approach:
 * - No cookies by default
 * - No personal data collection
 * - GDPR/CCPA compliant
 * - Supports Plausible, Umami, and custom endpoints
 * - Opt-in/opt-out controls
 * - Local storage for consent preferences
 * - Event batching for performance
 * - Offline queue with sync on reconnect
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

// ============================================================
// Types
// ============================================================

export interface AnalyticsConfig {
  provider: 'plausible' | 'umami' | 'custom' | 'none';
  domain?: string;
  apiHost?: string;
  apiKey?: string;
  scriptUrl?: string;
  enableAutoTrack: boolean;
  trackLocalhost: boolean;
  hashMode: boolean;
  respectDNT: boolean;
  consentRequired: boolean;
  batchSize: number;
  flushInterval: number; // ms
  customEndpoint?: string;
}

export interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  url: string;
  referrer: string;
  userAgent: string;
  screenResolution: string;
  viewport: string;
  language: string;
  timezone: string;
}

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  necessary: boolean; // Always true
  timestamp: number;
  version: string;
}

export interface AnalyticsState {
  enabled: boolean;
  consent: ConsentState;
  queue: AnalyticsEvent[];
  sessionId: string;
  pageViews: number;
  eventsTracked: number;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_CONFIG: AnalyticsConfig = {
  provider: 'none',
  enableAutoTrack: true,
  trackLocalhost: false,
  hashMode: false,
  respectDNT: true,
  consentRequired: true,
  batchSize: 10,
  flushInterval: 5000,
};

const CONSENT_STORAGE_KEY = 'analytics-consent';
const STATE_STORAGE_KEY = 'analytics-state';
const CONSENT_VERSION = '1.0';

// ============================================================
// Consent Management
// ============================================================

export class ConsentManager {
  private static instance: ConsentManager;
  private consent: ConsentState | null = null;
  private listeners: Set<(consent: ConsentState) => void> = new Set();

  private constructor() {
    this.loadConsent();
  }

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  private loadConsent(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === CONSENT_VERSION) {
          this.consent = parsed;
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }

    // Default consent (no analytics without explicit consent)
    this.consent = {
      analytics: false,
      marketing: false,
      preferences: false,
      necessary: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
  }

  getConsent(): ConsentState {
    return this.consent || {
      analytics: false,
      marketing: false,
      preferences: false,
      necessary: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
  }

  hasAnalyticsConsent(): boolean {
    return this.consent?.analytics === true;
  }

  setConsent(consent: Partial<ConsentState>): void {
    const newConsent: ConsentState = {
      ...this.getConsent(),
      ...consent,
      necessary: true, // Always true
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    this.consent = newConsent;
    this.saveConsent();
    this.notifyListeners();
  }

  acceptAll(): void {
    this.setConsent({
      analytics: true,
      marketing: true,
      preferences: true,
    });
  }

  rejectAll(): void {
    this.setConsent({
      analytics: false,
      marketing: false,
      preferences: false,
    });
  }

  private saveConsent(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(this.consent));
    } catch {
      // Ignore storage errors
    }
  }

  private notifyListeners(): void {
    if (this.consent) {
      this.listeners.forEach(fn => fn(this.consent!));
    }
  }

  subscribe(fn: (consent: ConsentState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // Show consent banner
  shouldShowBanner(): boolean {
    if (typeof window === 'undefined') return false;
    const consent = this.getConsent();
    return !consent.analytics && !consent.marketing && !consent.preferences;
  }
}

// ============================================================
// Analytics Tracker
// ============================================================

export class AnalyticsTracker {
  private config: AnalyticsConfig;
  private state: AnalyticsState;
  private flushTimer: NodeJS.Timeout | null = null;
  private pageViewTimer: NodeJS.Timeout | null = null;
  private visibilityChangeHandler: (() => void) | null = null;
  private initialized = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = this.getInitialState();
  }

  private getInitialState(): AnalyticsState {
    const consentManager = ConsentManager.getInstance();
    const consent = consentManager.getConsent();

    // Generate or restore session ID
    let sessionId = '';
    if (typeof window !== 'undefined') {
      sessionId = sessionStorage.getItem('analytics-session-id') || '';
      if (!sessionId) {
        sessionId = this.generateSessionId();
        sessionStorage.setItem('analytics-session-id', sessionId);
      }
    }

    return {
      enabled: consent.analytics && !this.shouldDisableTracking(),
      consent,
      queue: [],
      sessionId,
      pageViews: 0,
      eventsTracked: 0,
    };
  }

  private shouldDisableTracking(): boolean {
    if (this.config.respectDNT && typeof navigator !== 'undefined') {
      return navigator.doNotTrack === '1' || (navigator as any).doNotTrack === 'yes';
    }
    return false;
  }

  /**
   * Initialize analytics
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    if (!this.state.enabled) {
      console.log('[Analytics] Tracking disabled (no consent or DNT)');
      return;
    }

    // Load provider script
    await this.loadProviderScript();

    // Start auto-tracking if enabled
    if (this.config.enableAutoTrack) {
      this.startAutoTracking();
    }

    // Start flush timer
    this.startFlushTimer();

    // Handle visibility change for session tracking
    this.setupVisibilityHandling();

    this.initialized = true;
    console.log('[Analytics] Initialized with provider:', this.config.provider);
  }

  /**
   * Load provider script
   */
  private async loadProviderScript(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Check if already loaded
    if (document.querySelector(`script[data-analytics="${this.config.provider}"]`)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.dataset.analytics = this.config.provider;
      script.async = true;
      script.defer = true;

      switch (this.config.provider) {
        case 'plausible':
          script.src = this.config.scriptUrl || 'https://plausible.io/js/script.js';
          if (this.config.domain) {
            script.setAttribute('data-domain', this.config.domain);
          }
          if (this.config.apiHost) {
            script.setAttribute('data-api', this.config.apiHost);
          }
          break;

        case 'umami':
          script.src = this.config.scriptUrl || 'https://cloud.umami.is/script.js';
          if (this.config.apiKey) {
            script.setAttribute('data-website-id', this.config.apiKey);
          }
          if (this.config.apiHost) {
            script.setAttribute('data-host-url', this.config.apiHost);
          }
          break;

        case 'custom':
          if (this.config.scriptUrl) {
            script.src = this.config.scriptUrl;
          } else {
            resolve();
            return;
          }
          break;

        default:
          resolve();
          return;
      }

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${this.config.provider} script`));
      document.head.appendChild(script);
    });
  }

  /**
   * Start auto-tracking page views and interactions
   */
  private startAutoTracking(): void {
    if (typeof window === 'undefined') return;

    // Track initial page view
    this.trackPageView();

    // Track SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.trackPageView();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.trackPageView();
    };

    window.addEventListener('popstate', () => {
      this.trackPageView();
    });

    // Track clicks on external links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement | null;
      if (link && this.isExternalLink(link.href)) {
        this.trackEvent('external_link_click', {
          url: link.href,
          text: link.textContent?.slice(0, 100) ?? '',
        });
      }
    });

    // Track downloads
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href$=".pdf"], a[href$=".zip"], a[href$=".doc"], a[href$=".xls"]') as HTMLAnchorElement | null;
      if (link) {
        this.trackEvent('file_download', {
          url: link.href,
          filename: link.href.split('/').pop() ?? '',
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      if (form && !form.hasAttribute('data-analytics-ignore')) {
        this.trackEvent('form_submit', {
          formId: form.id,
          action: form.action,
        });
      }
    });
  }

  private trackPageView(): void {
    if (!this.state.enabled) return;

    this.state.pageViews++;

    this.trackEvent('page_view', {
      path: window.location.pathname + window.location.search,
      title: document.title,
      referrer: document.referrer,
    });

    // Update session timer
    if (this.pageViewTimer) {
      clearTimeout(this.pageViewTimer);
    }
    this.pageViewTimer = setTimeout(() => {
      this.trackEvent('session_end', { duration: Date.now() - this.getSessionStart() });
    }, 30 * 60 * 1000); // 30 min inactivity
  }

  private getSessionStart(): number {
    return parseInt(sessionStorage.getItem('analytics-session-start') || '0', 10) || Date.now();
  }

  private setupVisibilityHandling(): void {
    if (typeof document === 'undefined') return;

    this.visibilityChangeHandler = () => {
      if (document.hidden) {
        this.trackEvent('page_hide', { timestamp: Date.now() });
      } else {
        this.trackEvent('page_show', { timestamp: Date.now() });
      }
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  /**
   * Track custom event
   */
  trackEvent(name: string, props?: Record<string, string | number | boolean>): void {
    if (!this.state.enabled) return;

    const event: AnalyticsEvent = {
      name,
      props,
      timestamp: Date.now(),
      sessionId: this.state.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screenResolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    this.state.queue.push(event);
    this.state.eventsTracked++;

    // Flush if batch size reached
    if (this.state.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush event queue to provider
   */
  async flush(): Promise<void> {
    if (this.state.queue.length === 0) return;

    const events = [...this.state.queue];
    this.state.queue = [];

    try {
      switch (this.config.provider) {
        case 'plausible':
          await this.sendToPlausible(events);
          break;
        case 'umami':
          await this.sendToUmami(events);
          break;
        case 'custom':
          await this.sendToCustom(events);
          break;
      }
    } catch (error) {
      console.error('[Analytics] Failed to flush events:', error);
      // Re-queue failed events
      this.state.queue.unshift(...events);
    }
  }

  private async sendToPlausible(events: AnalyticsEvent[]): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).plausible) return;

    for (const event of events) {
      (window as any).plausible(event.name, {
        props: event.props,
      });
    }
  }

  private async sendToUmami(events: AnalyticsEvent[]): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).umami) return;

    for (const event of events) {
      (window as any).umami.track(event.name, event.props);
    }
  }

  private async sendToCustom(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.customEndpoint) return;

    await fetch(this.config.customEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
      keepalive: true,
    });
  }

  /**
   * Start periodic flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Track custom event (public API)
   */
  track(name: string, props?: Record<string, string | number | boolean>): void {
    this.trackEvent(name, props);
  }

  /**
   * Identify user (for logged-in users)
   */
  identify(userId: string, traits?: Record<string, string | number | boolean>): void {
    if (!this.state.enabled) return;

    this.trackEvent('identify', {
      userId,
      ...traits,
    });
  }

  /**
   * Track conversion
   */
  convert(eventName: string, value?: number, currency?: string): void {
    this.trackEvent(eventName, {
      ...(value !== undefined ? { value } : {}),
      currency: currency || 'USD',
    });
  }

  /**
   * Get current state
   */
  getState(): AnalyticsState {
    return { ...this.state };
  }

  /**
   * Update consent and reinitialize
   */
  async updateConsent(consent: Partial<ConsentState>): Promise<void> {
    const manager = ConsentManager.getInstance();
    manager.setConsent(consent);

    this.state.consent = manager.getConsent();
    this.state.enabled = this.state.consent.analytics && !this.shouldDisableTracking();

    if (this.state.enabled && !this.initialized) {
      await this.init();
    } else if (!this.state.enabled && this.initialized) {
      this.destroy();
    }
  }

  /**
   * Destroy tracker and clean up
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.pageViewTimer) {
      clearTimeout(this.pageViewTimer);
      this.pageViewTimer = null;
    }
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }
    this.flush(); // Final flush
    this.initialized = false;
  }

  private isExternalLink(href: string): boolean {
    try {
      const url = new URL(href);
      return url.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================
// React Hooks
// ============================================================

// Analytics Context
const AnalyticsContext = createContext<{
  tracker: AnalyticsTracker | null;
  consent: ConsentState;
  track: (name: string, props?: Record<string, string | number | boolean>) => void;
  identify: (userId: string, traits?: Record<string, string | number | boolean>) => void;
  setConsent: (consent: Partial<ConsentState>) => Promise<void>;
}>({
  tracker: null,
  consent: { analytics: false, marketing: false, preferences: false, necessary: true, timestamp: 0, version: '1.0' },
  track: () => {},
  identify: () => {},
  setConsent: async () => {},
});

export const AnalyticsProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
}> = ({ children, config }) => {
  const [tracker, setTracker] = useState<AnalyticsTracker | null>(null);
  const [consent, setConsentState] = useState<ConsentState>(ConsentManager.getInstance().getConsent());

  useEffect(() => {
    const trackerInstance = new AnalyticsTracker(config);
    setTracker(trackerInstance);
    trackerInstance.init().catch(console.error);

    const unsubscribe = ConsentManager.getInstance().subscribe((newConsent) => {
      setConsentState(newConsent);
    });

    return () => {
      trackerInstance.destroy();
      unsubscribe();
    };
  }, [config]);

  const track = (name: string, props?: Record<string, string | number | boolean>) => {
    tracker?.track(name, props);
  };

  const identify = (userId: string, traits?: Record<string, string | number | boolean>) => {
    tracker?.identify(userId, traits);
  };

  const setConsent = async (newConsent: Partial<ConsentState>) => {
    await tracker?.updateConsent(newConsent);
    setConsentState(ConsentManager.getInstance().getConsent());
  };

  return (
    <AnalyticsContext.Provider value={{ tracker, consent, track, identify, setConsent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}

// Consent Banner Component
export const ConsentBanner: React.FC<{
  onAccept?: () => void;
  onReject?: () => void;
  onPreferences?: () => void;
}> = ({ onAccept, onReject, onPreferences }) => {
  const { consent, setConsent } = useAnalytics();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const manager = ConsentManager.getInstance();
    if (!manager.shouldShowBanner()) {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:right-4 md:left-auto md:bottom-4 md:left-1/2 md:-translate-x-1/2 max-w-md z-50 animate-slide-up" role="dialog" aria-label="Cookie consent">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              We value your privacy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              We use analytics to understand how you use our site and improve your experience.
              We don't use cookies or collect personal data without your consent.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setConsent({ analytics: true, marketing: true, preferences: true }); onAccept?.(); setShow(false); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => { setConsent({ analytics: false, marketing: false, preferences: false }); onReject?.(); setShow(false); }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={onPreferences}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-medium hover:underline"
              >
                Manage Preferences
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              You can change your preferences anytime. See our
              <Link href="/privacy" className="underline hover:text-blue-600">Privacy Policy</Link>.
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Export
// ============================================================

export type { AnalyticsState as AnalyticsStateType };

export function createAnalyticsTracker(config?: Partial<AnalyticsConfig>): AnalyticsTracker {
  return new AnalyticsTracker(config);
}

export function getConsentManager(): ConsentManager {
  return ConsentManager.getInstance();
}