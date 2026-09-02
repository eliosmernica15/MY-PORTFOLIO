import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with 'dark' on the server AND on the first client render so
  // SSR and the hydration pass produce identical markup. localStorage is read
  // inside an effect (post-hydration) and `useState` is updated there. The
  // visible theme is driven by the <html data-theme="..."> attribute that the
  // server already sets from the cookie, so reading localStorage here is only
  // for keeping the toggle button in sync with the user's previous choice.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // After hydration, read the user's stored preference (if any) and sync
    // both the context and the <html data-theme> attribute.
    const stored = (typeof window !== 'undefined'
      ? (localStorage.getItem('theme') as Theme | null)
      : null);
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* private mode / quota — ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
