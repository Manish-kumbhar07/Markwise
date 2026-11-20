'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-8 bg-[var(--card)]/80 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-200">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, verified claims, policies..."
            className="w-full pl-10 pr-12 py-2 text-xs rounded-xl bg-[var(--background)]/70 border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#123B2F] dark:focus:ring-emerald-400 focus:border-transparent transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--card)] border border-[var(--border)] rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Theme Toggle & User Profile */}
      <div className="flex items-center gap-3">
        {/* Governance Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Policies Active</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--background)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F47745] rounded-full" />
        </button>

        {/* Theme Toggle (Sun / Moon) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--background)]/80 hover:bg-[var(--background)] border border-[var(--border)] text-[var(--text)] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
        >
          {mounted ? (
            resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#123B2F] transition-transform duration-200 hover:-rotate-12" />
            )
          ) : (
            <div className="w-4 h-4 rounded-full bg-[var(--border)] animate-pulse" />
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-[var(--border)] mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#123B2F] to-[#1E604D] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white/20">
              MK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--card)] rounded-full" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[var(--text)] group-hover:text-[#123B2F] dark:group-hover:text-emerald-400 transition-colors">
              Acme Enterprise
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              Brand Guardian
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors" />
        </div>
      </div>
    </header>
  );
}

export default Header;
