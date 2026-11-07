'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useLocaleContext } from '@/i18n/LocaleProvider';
import { Locale, localeNames, localeFlags, localeDirections } from '@/i18n/config';
import MagneticButton from './MagneticButton';

interface LocaleSwitcherProps {
  /** Show as dropdown or inline */
  variant?: 'dropdown' | 'inline';
  /** Custom className */
  className?: string;
  /** Show flag */
  showFlag?: boolean;
  /** Show locale name */
  showName?: boolean;
  /** Custom button text for inline variant */
  inlineText?: string;
}

/**
 * LocaleSwitcher - UI component for selecting language
 * Features:
 * - Dropdown and inline variants
 * - Live locale preview
 * - Keyboard accessible
 * - Animated dropdown
 * - Respects RTL languages
 */
export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
  showFlag = true,
  showName = true,
  inlineText,
} = {}) => {
  const { locale, locales: availableLocales, setLocale } = useLocaleContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const currentLocaleInfo = {
    code: locale,
    name: localeNames[locale],
    flag: localeFlags[locale],
    direction: 'ltr', // Both en and sq are LTR
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Language selection">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Language
        </span>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {(['en', 'sq'] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                locale === loc
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-accent'
                  : 'hover:bg-[var(--surface-elevated)]'
              }`}
              style={{
                color: locale === loc ? 'var(--accent-contrast)' : 'var(--text-secondary)',
              }}
              aria-pressed={locale === loc}
              aria-label={`Switch to ${localeNames[loc]} mode`}
            >
              {localeFlags[loc]}
              <span>{localeNames[loc]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <MagneticButton
        strength={0.2}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open language selector"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
            <Globe size={14} style={{ color: 'var(--accent-contrast)' }} />
          </div>
          {showName && (
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              {currentLocaleInfo.code.toUpperCase()}
            </span>
          )}
          <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </MagneticButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-80 z-50"
          >
            <div
              ref={dropdownRef}
              className="rounded-2xl overflow-hidden p-2"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 60px var(--shadow-color)' }}
            >
              <div className="px-2 py-1">
                <span className="block px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Language
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {(['en', 'sq'] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocaleChange(loc)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      locale === loc
                        ? 'w-6 h-2 bg-[var(--accent)]'
                        : 'w-2 h-2 hover:opacity-60'
                    }`}
                    style={locale !== loc ? { backgroundColor: 'var(--border)' } : undefined}
                    aria-label={`Go to locale ${loc}`}
                    aria-current={locale === loc ? 'true' : undefined}
                  >
                    <span className="text-xl">{localeFlags[loc]}</span>
                    <span className="font-medium">{localeNames[loc]}</span>
                    {locale === loc && (
                      <Check className="ml-auto w-4 h-4 text-[var(--accent-contrast)]" style={{ background: 'var(--accent)', borderRadius: '50%' }} size={12} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocaleSwitcher;