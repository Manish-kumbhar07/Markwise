'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('Dashboard runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
            Something went wrong
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {error.message || 'An unexpected error occurred while loading the dashboard.'}
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B2F] dark:bg-emerald-500 hover:bg-[#184e3e] dark:hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--background)] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
