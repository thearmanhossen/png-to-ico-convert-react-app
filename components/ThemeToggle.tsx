import React from 'react';
import { MoonIcon, SunIcon } from './Icons';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm transition hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-white"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
};
