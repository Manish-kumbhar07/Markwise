import React from 'react';
import Link from 'next/link';
import { Search, Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#242820] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#FFFCF6] border border-[#E8DFD0] shadow-xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
          <Search className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#123B2F]">Page Not Found</h1>
          <p className="text-xs text-[#545B4E] leading-relaxed">
            The page or resource you requested does not exist or has been relocated.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B2F] hover:bg-[#184e3e] text-white text-xs font-semibold shadow-md transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8DFD0] bg-[#FFFCF6] text-xs font-semibold text-[#242820] hover:bg-[#F7F2E8] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
