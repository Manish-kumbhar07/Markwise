import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-200">
      {/* 1. Slim Fixed Sidebar (w-20) */}
      <Sidebar />

      {/* 2. Main Content Area with Header */}
      <div className="pl-20 flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
