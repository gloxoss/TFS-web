// components/theme-toggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const THEME_LIGHT = 'lofi';
const THEME_DARK = 'dark';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialIsDark = savedTheme ? savedTheme === THEME_DARK : systemPrefersDark;
    
    setIsDark(initialIsDark);
    document.documentElement.setAttribute('data-theme', initialIsDark ? THEME_DARK : THEME_LIGHT);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    const newTheme = newIsDark ? THEME_DARK : THEME_LIGHT;
    
    setIsDark(newIsDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}