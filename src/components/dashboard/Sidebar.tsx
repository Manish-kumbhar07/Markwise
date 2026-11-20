'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileCheck2,
  BookOpen,
  Database,
  Settings,
  Shield,
  ArrowLeft,
  ClipboardCheck,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rules', href: '/dashboard/rules', icon: BookOpen },
  { name: 'Review', href: '/dashboard/review', icon: FileCheck2 },
  { name: 'Approvals', href: '/dashboard/approvals', icon: ClipboardCheck },
  { name: 'Facts', href: '/dashboard/facts', icon: Database },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-20 flex flex-col items-center justify-between py-6 bg-[var(--card)] border-r border-[var(--border)] transition-colors duration-200">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/"
          className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#123B2F] text-white shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105"
          title="Markwise Home"
        >
          <Shield className="w-6 h-6 stroke-[2.2] text-[#F47745] group-hover:rotate-6 transition-transform" />
          <span className="sr-only">Markwise Home</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col items-center gap-3 w-full px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200"
              title={item.name}
            >
              {/* Glowing active indicator: Sage green pill */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl bg-[#123B2F]/10 dark:bg-emerald-500/20 border border-[#123B2F]/20 dark:border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* 3D Animated Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative z-10 flex items-center justify-center ${
                  isActive
                    ? 'text-[#123B2F] dark:text-emerald-400 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </motion.div>

              {/* Left active vertical accent bar */}
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#123B2F] dark:bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}

              {/* Tooltip on hover */}
              <div className="absolute left-16 px-2.5 py-1 rounded-md bg-[#242820] text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg whitespace-nowrap z-50">
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Exit / Back to site at bottom */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/"
          className="group relative flex items-center justify-center w-11 h-11 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--background)] transition-all duration-200"
          title="Return to Public Website"
        >
          <motion.div whileHover={{ scale: 1.1, rotate: -8 }}>
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </motion.div>
          <div className="absolute left-16 px-2.5 py-1 rounded-md bg-[#242820] text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg whitespace-nowrap z-50">
            Exit to Home
          </div>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
