'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileCheck2,
  Clock,
  Sparkles,
  ChevronRight,
  Database,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

// Dynamically import Recharts component with ssr: false to prevent SSR hydration errors
const BrandHealthChart = dynamic(
  () => import('./BrandHealthChart'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

interface ActiveTask {
  id: string;
  title: string;
  channel: string;
  issuesCount: number;
  status: 'NEEDS_REVIEW' | 'FLAGGED' | 'COMPLIANT';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  author: string;
  time: string;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  actor: string;
  time: string;
  type: 'RULE_UPDATED' | 'CLAIM_ANCHORED' | 'DIFF_APPROVED' | 'SCAN_PASSED';
}

const activeTasks: ActiveTask[] = [
  {
    id: 'task-1',
    title: 'Q4 Enterprise Cloud SLA & Uptime Guarantee Announcement',
    channel: 'Press Release',
    issuesCount: 3,
    status: 'FLAGGED',
    priority: 'HIGH',
    author: 'Sarah Chen (PMM)',
    time: '8m ago',
  },
  {
    id: 'task-2',
    title: 'Landing Page Hero Copy - SOC 2 Type II Pass-through Claims',
    channel: 'Marketing Web',
    issuesCount: 1,
    status: 'NEEDS_REVIEW',
    priority: 'MEDIUM',
    author: 'Alex Rivera (Content)',
    time: '24m ago',
  },
  {
    id: 'task-3',
    title: 'Partner Ecosystem Co-Selling Compliance Deck v2.4',
    channel: 'Sales Enablement',
    issuesCount: 0,
    status: 'COMPLIANT',
    priority: 'LOW',
    author: 'David Kim (Enablement)',
    time: '1h ago',
  },
];

const recentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Brand Rule #BR-104 Version 2.1 Published',
    description: 'Updated prohibited superlative threshold for latency claims.',
    actor: 'Legal Guardian',
    time: '4m ago',
    type: 'RULE_UPDATED',
  },
  {
    id: 'act-2',
    title: 'Fact Vault Evidence Refreshed',
    description: 'FDIC Pass-Through Custodial filing anchored to SEC Exhibit 10.3.',
    actor: 'Compliance Team',
    time: '18m ago',
    type: 'CLAIM_ANCHORED',
  },
  {
    id: 'act-3',
    title: 'Editorial Override Approved & Codified',
    description: 'Acme Uptime SLA claim approved with mandatory disclaimer citation.',
    actor: 'Head of Legal',
    time: '42m ago',
    type: 'DIFF_APPROVED',
  },
  {
    id: 'act-4',
    title: 'Deterministic AI Scan Completed',
    description: 'Passed 14 strict policy checks across Marketing Blog draft #891.',
    actor: 'Gemini 2.5 Flash',
    time: '1h ago',
    type: 'SCAN_PASSED',
  },
];

export function OverviewView() {
  return (
    <div className="space-y-8">
      {/* 1. Header Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Enterprise Governance Engine
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] font-serif">
            Brand Governance Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">
            Continuous compliance surveillance, causal policy explainability, and evidence anchoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/review"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#123B2F] dark:bg-emerald-500 hover:bg-[#1A4C3E] dark:hover:bg-emerald-400 text-white dark:text-gray-950 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan New Draft</span>
          </Link>
          <Link
            href="/dashboard/rules"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--card)] hover:bg-[var(--background)] border border-[var(--border)] text-[var(--text)] shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Rules</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Brand Health Index
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text)]">96.8%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +2.4% this week
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Based on 148 verified marketing assertions
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Active Brand Rules
            </span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text)]">38</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              4 categories
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Zero ambiguous guidelines; 100% codified
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Fact Vault Anchors
            </span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text)]">142</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              All Valid
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Linked to audited SEC, SLA & legal filings
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Resolution Velocity
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text)]">&lt; 450ms</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              1-Click Fix
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Average time to apply suggested rewrite
          </p>
        </motion.div>
      </div>

      {/* 3. Main Brand Health KPI Card with 3D Hover Lift */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-md transition-all duration-200"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold tracking-tight text-[var(--text)] font-serif">
                Brand Health & Verification Velocity
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Weekly volume of scanned claims, detected compliance flags, and applied 1-click fixes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Timeframe:</span>
            <div className="px-3 py-1.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]">
              Last 7 Days (Real-time)
            </div>
          </div>
        </div>

        {/* Recharts BarChart */}
        <BrandHealthChart />
      </motion.div>

      {/* 4. Active Tasks & Recent Activity Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tasks Card (Slides in with framer-motion) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 sm:p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#123B2F]/10 dark:bg-emerald-500/20 text-[#123B2F] dark:text-emerald-400 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text)] font-serif">
                  Active Tasks & Approvals
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Drafts awaiting policy review or guardian sign-off
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/review"
              className="text-xs font-semibold text-[#123B2F] dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Task Items */}
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-[var(--background)]/60 hover:bg-[var(--background)] border border-[var(--border)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)]">
                      {task.channel}
                    </span>
                    {task.priority === 'HIGH' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        High Risk
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--text)] group-hover:text-[#123B2F] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    <span>{task.author}</span>
                    <span>•</span>
                    <span>{task.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {task.issuesCount > 0 ? (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{task.issuesCount} issue{task.issuesCount > 1 ? 's' : ''}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Clean</span>
                    </span>
                  )}
                  <Link
                    href="/dashboard/review"
                    className="p-1.5 rounded-lg bg-[var(--card)] hover:bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Card (Slides in with framer-motion) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 sm:p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Clock className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text)] font-serif">
                  Audit Log & Recent Activity
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Cryptographic policy enforcement & evidence trail
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)]">
              Immutable
            </span>
          </div>

          {/* Activity Stream */}
          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[var(--background)]/60 transition-colors"
              >
                <div className="mt-0.5 w-7 h-7 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[#123B2F] dark:text-emerald-400 shrink-0">
                  {act.type === 'RULE_UPDATED' && <BookOpen className="w-3.5 h-3.5" />}
                  {act.type === 'CLAIM_ANCHORED' && <Database className="w-3.5 h-3.5" />}
                  {act.type === 'DIFF_APPROVED' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {act.type === 'SCAN_PASSED' && <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-semibold text-[var(--text)] truncate">
                      {act.title}
                    </h5>
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {act.description}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium text-[#123B2F] dark:text-emerald-400">
                    By {act.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OverviewView;
