'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error Boundary]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F2E8] text-[#242820] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#FFFCF6] border border-[#E8DFD0] shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center">
            <AlertOctagon className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#123B2F]">
              Critical System Error
            </h1>
            <p className="text-xs text-[#545B4E] leading-relaxed">
              An unexpected system failure occurred. Our telemetry has logged the error digest.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-[#7A8274] bg-[#F7F2E8] p-2 rounded-lg">
                Digest ID: {error.digest}
              </p>
            )}
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => reset()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#123B2F] hover:bg-[#184e3e] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
            <a
              href="/login"
              className="text-xs text-[#545B4E] hover:text-[#123B2F] underline pt-1"
            >
              Back to Login
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
