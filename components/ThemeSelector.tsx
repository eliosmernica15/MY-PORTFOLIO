'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Clock, Palette, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { ACCENT_PALETTES } from '@/lib/theme.tokens';
import MagneticButton from './MagneticButton';
import AdvancedButton from './ui/AdvancedButton';

interface ThemeSelectorProps {
  /** Show as dropdown or inline */
  variant?: 'dropdown' | 'inline';
  /** Show palette selector */
  showPalettes?: boolean;
  /** Show mode selector */
  showModes?: boolean;
  /** Show auto-switch toggle */
  showAutoSwitch?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * ThemeSelector - UI component for selecting theme palette and mode
 * Features:
 * - 8 curated accent color palettes with live preview
 * - Light/Dark/Auto/Time-based mode selection
 * - Time-of-day auto-switching toggle
 * - Live preview of palette colors
 * - Keyboard accessible
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  variant = 'dropdown',
  showPalettes = true,
  showModes = true,
  showAutoSwitch = true,
  className = '',
}) => {
  const {
    config,
    palette,
    mode,
    setPalette,
    setMode,
    setAutoSwitch,
    toggleTheme,
    availablePalettes,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPalette, setHoveredPalette] = useState<string | null>(null);

  // Get current mode display name
  const getModeLabel = (m: typeof config.mode) => {
    switch (m) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'auto': return 'Auto (System)';
      case 'time': return 'Time-based';
    }
  };

  const getModeIcon = (m: typeof config.mode) => {
    switch (m) {
      case 'light': return <Sun size={16} />;
      case 'dark': return <Moon size={16} />;
      case 'auto': return <Monitor size={16} />;
      case 'time': return <Clock size={16} />;
    }
  };

  const handlePaletteClick = (paletteId: string) => {
    setPalette(paletteId);
    if (variant === 'dropdown') setIsOpen(false);
  };

  const handleModeClick = (newMode: typeof config.mode) => {
    if (config.mode === 'auto' || config.mode === 'time') {
      // Clear manual override when explicitly selecting a mode
      localStorage.removeItem('theme-manual-override');
    }
    setMode(newMode);
    if (variant === 'dropdown') setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`} style={{ flexWrap: 'wrap' }}>
        {/* Mode Selector */}
        {showModes && (
          <div className="flex items-center gap-2" role="group" aria-label="Theme mode">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Mode
            </span>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {(['light', 'dark', 'auto', 'time'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => handleModeClick(m)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    config.mode === m
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-accent'
                      : 'hover:bg-[var(--surface-elevated)]'
                  }`}
                  style={{
                    color: config.mode === m ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                  }}
                  aria-pressed={config.mode === m}
                  aria-label={`Switch to ${m} mode`}
                >
                  {getModeIcon(m)}
                  <span>{getModeLabel(m)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Palette Selector */}
        {showPalettes && (
          <div className="flex items-center gap-2" role="group" aria-label="Accent color">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Accent
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {ACCENT_PALETTES.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePaletteClick(p.id)}
                  className={`relative w-8 h-8 rounded-xl transition-all ${
                    config.paletteId === p.id ? 'ring-2 ring-[var(--accent)] scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${p.light.accent}, ${p.dark.accent})`,
                    border: config.paletteId === p.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                  }}
                  aria-pressed={config.paletteId === p.id}
                  aria-label={p.name}
                  title={p.name}
                >
                  {config.paletteId === p.id && (
                    <Check className="absolute top-0 right-0 w-4 h-4 text-[var(--accent-contrast)]" style={{ background: 'var(--accent)', borderRadius: '50%' }} size={10} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auto-switch Toggle */}
        {showAutoSwitch && (config.mode === 'time' || config.mode === 'auto') && (
          <div className="flex items-center gap-2" role="group" aria-label="Auto switch">
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={config.autoSwitch}
                onChange={e => setAutoSwitch(e.target.checked)}
                className="w-4 h-4 rounded border appearance-none cursor-pointer"
                style={{
                  borderColor: 'var(--border)',
                  accentColor: 'var(--accent)',
                }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Auto-switch
              </span>
            </label>
          </div>
        )}

        {/* Quick Toggle Button */}
        <MagneticButton strength={0.2} onClick={toggleTheme} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>
            {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </div>
        </MagneticButton>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <MagneticButton
        strength={0.2}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open theme settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
            <Palette size={14} style={{ color: 'var(--accent-contrast)' }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            Theme
          </span>
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
            <div className="rounded-2xl overflow-hidden p-4" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 60px var(--shadow-color)' }}>
              {/* Mode Selector */}
              {showModes && (
                <div className="mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    Mode
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(['light', 'dark', 'auto', 'time'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => { handleModeClick(m); setIsOpen(false); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          config.mode === m
                            ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                            : 'hover:bg-[var(--surface-elevated)]'
                        }`}
                        style={{ color: config.mode === m ? 'var(--accent-contrast)' : 'var(--text-secondary)' }}
                        aria-pressed={config.mode === m}
                      >
                        {getModeIcon(m)}
                        <span>{getModeLabel(m)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Palette Selector */}
              {showPalettes && (
                <div className="mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    Accent Color
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {ACCENT_PALETTES.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { handlePaletteClick(p.id); setIsOpen(false); }}
                        className={`relative w-10 h-10 rounded-xl transition-all ${
                          config.paletteId === p.id ? 'ring-2 ring-[var(--accent)] scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${p.light.accent}, ${p.dark.accent})`,
                          border: config.paletteId === p.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                        }}
                        aria-pressed={config.paletteId === p.id}
                        aria-label={p.name}
                        title={p.name}
                      >
                        {config.paletteId === p.id && (
                          <Check className="absolute top-1 right-1 w-4 h-4 text-[var(--accent-contrast)]" style={{ background: 'var(--accent)', borderRadius: '50%' }} size={12} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto-switch Toggle */}
              {showAutoSwitch && (config.mode === 'time' || config.mode === 'auto') && (
                <div className="flex items-center justify-between py-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={config.autoSwitch}
                      onChange={e => setAutoSwitch(e.target.checked)}
                      className="w-4 h-4 rounded border appearance-none cursor-pointer"
                      style={{
                        borderColor: 'var(--border)',
                        accentColor: 'var(--accent)',
                      }}
                    />
                    <span className="text-sm font-medium">
                      {config.mode === 'time' ? 'Auto-switch by time' : 'Auto-switch by system'}
                    </span>
                  </label>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <MagneticButton strength={0.2} onClick={toggleTheme} className="flex-1" variant="secondary" size="sm">
                  {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  <span className="hidden sm:inline">{mode === 'dark' ? 'Light' : 'Dark'}</span>
                </MagneticButton>
                <MagneticButton strength={0.2} onClick={() => { setMode('auto'); setIsOpen(false); }} variant="secondary" size="sm" className="flex-1">
                  <Monitor size={14} />
                  <span className="hidden sm:inline">Auto</span>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;