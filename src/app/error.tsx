'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--background,#F7F2E8)] text-[var(--text,#242820)] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--card,#FFFCF6)] border border-[var(--border,#E8DFD0)] shadow-xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Something went wrong</h2>
          <p className="text-xs text-[var(--text-muted,#545B4E)] leading-relaxed">
            {error.message || 'An unexpected error occurred while loading this view.'}
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B2F] hover:bg-[#184e3e] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border,#E8DFD0)] bg-[var(--card,#FFFCF6)] text-xs font-semibold text-[var(--text,#242820)] hover:bg-[var(--background,#F7F2E8)] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
