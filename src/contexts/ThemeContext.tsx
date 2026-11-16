import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';
type Resolved = 'dark' | 'light';

interface Ctx {
  theme: ThemeMode;
  resolved: Resolved;
  setTheme: (t: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<Ctx>({
  theme: 'dark',
  resolved: 'dark',
  setTheme: () => {},
  toggle: () => {},
});

const STORAGE_KEY = 'ak3or-theme';

function systemPref(): Resolved {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'dark';
  });
  const [resolved, setResolved] = useState<Resolved>(() =>
    theme === 'system' ? systemPref() : theme
  );

  const apply = useCallback((t: ThemeMode) => {
    const r = t === 'system' ? systemPref() : t;
    setResolved(r);
    document.documentElement.setAttribute('data-theme', r);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', r === 'dark' ? '#070912' : '#f5f6ff');
  }, []);

  useEffect(() => {
    apply(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, apply]);

  useEffect(() => {
    if (theme !== 'system' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => apply('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, apply]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const toggle = () => setThemeState(resolved === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
