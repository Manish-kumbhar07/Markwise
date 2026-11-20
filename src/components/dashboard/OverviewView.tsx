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
import type { HealthDataPoint } from './BrandHealthChart';

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

export interface ActiveTask {
  id: string;
  title: string;
  channel: string;
  issuesCount: number;
  status: 'NEEDS_REVIEW' | 'FLAGGED' | 'COMPLIANT';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  author: string;
  time: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  actor: string;
  time: string;
  type: 'RULE_UPDATED' | 'CLAIM_ANCHORED' | 'DIFF_APPROVED' | 'SCAN_PASSED';
}

export interface OverviewData {
  brandHealthScore: number;
  rulesCount: number;
  factsCount: number;
  pendingApprovalsCount: number;
  activeTasks: ActiveTask[];
  recentActivities: ActivityItem[];
  weeklyHealthData?: HealthDataPoint[];
}

export function OverviewView({ data }: { data: OverviewData }) {
  const {
    brandHealthScore,
    rulesCount,
    factsCount,
    pendingApprovalsCount,
    activeTasks,
    recentActivities,
    weeklyHealthData,
  } = data;

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
            <span className="text-3xl font-bold text-[var(--text)]">{brandHealthScore}%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {brandHealthScore >= 90 ? 'Optimal' : brandHealthScore >= 75 ? 'Good' : 'Needs Review'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Continuous audit across workspace assets
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
            <span className="text-3xl font-bold text-[var(--text)]">{rulesCount}</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              Enforced
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Codified policies applied across drafts
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
            <span className="text-3xl font-bold text-[var(--text)]">{factsCount}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Verified
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Audited legal and statutory filings
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Pending Approvals
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text)]">{pendingApprovalsCount}</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              In Review
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Awaiting compliance sign-off
          </p>
        </motion.div>
      </div>

      {/* 3. Main Chart: Brand Health & Compliance Breakdown */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="p-6 sm:p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text)] font-serif">
              Compliance Trajectory &amp; Rule Violations
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Weekly volume of compliant assertions vs. flagged violations and 1-click fixes.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-[var(--text-muted)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Real-time Workspace Activity</span>
          </div>
        </div>

        <BrandHealthChart data={weeklyHealthData} />
      </motion.div>

      {/* 4. Two-Column Lower Section: Active Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Active Tasks Card (Slides in with framer-motion) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 sm:p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text)] font-serif">
                  Active Reviews &amp; Content
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Marketing and product copy tracked in workspace
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
            {activeTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-2">
                <p className="text-xs font-semibold text-[var(--text)]">No active drafts in this workspace.</p>
                <p className="text-[11px] text-[var(--text-muted)]">Drafts and reviews you create will appear here.</p>
                <Link
                  href="/dashboard/review"
                  className="inline-block mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Scan New Draft &rarr;
                </Link>
              </div>
            ) : (
              activeTasks.map((task) => (
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
              ))
            )}
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
                  Audit Log &amp; Recent Activity
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Cryptographic policy enforcement &amp; evidence trail
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)]">
              Live
            </span>
          </div>

          {/* Activity Stream */}
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-2">
                <p className="text-xs font-semibold text-[var(--text)]">No recent activity logged yet.</p>
                <p className="text-[11px] text-[var(--text-muted)]">Brand rule updates and scan results will automatically log here.</p>
              </div>
            ) : (
              recentActivities.map((act) => (
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
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OverviewView;
