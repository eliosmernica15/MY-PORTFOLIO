'use client';

import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import Terminal from '../components/Terminal';
import AssistantChat from '../components/AssistantChat';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      {/* Signature features — available on every page. */}
      <Terminal />
      <AssistantChat />
    </ThemeProvider>
  );
}
