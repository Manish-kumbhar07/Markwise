'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ApprovalContentItem,
  approveContent,
  rejectContent,
} from '@/app/actions/approvals';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  XCircle,
  FileText,
  User,
  Building2,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';

interface ApprovalsViewProps {
  initialQueue: ApprovalContentItem[];
}

interface ToastState {
  id: string;
  type: 'APPROVED' | 'REJECTED' | 'RESET';
  title: string;
  message: string;
}

export function ApprovalsView({ initialQueue }: ApprovalsViewProps) {
  const [queue, setQueue] = useState<ApprovalContentItem[]>(initialQueue);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'LOW'>('ALL');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const filteredQueue = queue.filter((item) => {
    if (filter === 'HIGH') return item.riskLevel === 'HIGH';
    if (filter === 'LOW') return item.riskLevel === 'LOW';
    return true;
  });

  const highRiskCount = queue.filter((i) => i.riskLevel === 'HIGH').length;
  const lowRiskCount = queue.filter((i) => i.riskLevel === 'LOW').length;

  const handleApprove = (item: ApprovalContentItem) => {
    setActiveItemId(item.id);
    startTransition(async () => {
      try {
        await approveContent(item.id);
        setQueue((prev) => prev.filter((q) => q.id !== item.id));
        setToast({
          id: Math.random().toString(),
          type: 'APPROVED',
          title: 'Content Approved & Published',
          message: `"${item.title}" has been signed off and cleared for production release.`,
        });
        setTimeout(() => setToast(null), 4500);
      } catch (err) {
        console.error('Failed to approve content:', err);
      } finally {
        setActiveItemId(null);
      }
    });
  };

  const handleReject = (item: ApprovalContentItem) => {
    setActiveItemId(item.id);
    startTransition(async () => {
      try {
        await rejectContent(item.id);
        setQueue((prev) => prev.filter((q) => q.id !== item.id));
        setToast({
          id: Math.random().toString(),
          type: 'REJECTED',
          title: 'Revisions Requested',
          message: `"${item.title}" returned to ${item.creator} with compliance revision notes.`,
        });
        setTimeout(() => setToast(null), 4500);
      } catch (err) {
        console.error('Failed to reject content:', err);
      } finally {
        setActiveItemId(null);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Framer Motion Floating Success/Rejection Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-6 right-6 z-50 max-w-md w-full shadow-2xl rounded-2xl p-4 border backdrop-blur-xl bg-[var(--card)]/95 text-[var(--text)] border-[var(--border)]"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 ${
                  toast.type === 'APPROVED'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}
              >
                {toast.type === 'APPROVED' ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold tracking-tight">
                  {toast.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with Stats & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Governance Sign-Off Gate
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Approval Queue
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Review, sign off, or request revisions on pending marketing copy and enterprise claims.
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-[#123B2F] dark:bg-emerald-500 text-white shadow-md'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            All Pending ({queue.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'HIGH'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-rose-500'
            }`}
          >
            High Risk ({highRiskCount})
          </button>
          <button
            onClick={() => setFilter('LOW')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'LOW'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-emerald-500'
            }`}
          >
            Ready to Release ({lowRiskCount})
          </button>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredQueue.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-bold tracking-tight">
                  Queue Cleared!
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1.5">
                  No content pending review in this view. All claims and marketing drafts have been vetted and released.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/dashboard/review"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B2F] dark:bg-emerald-500 text-white text-xs font-semibold hover:opacity-90 shadow-md transition-transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  Review New Copy
                </Link>
              </div>
            </motion.div>
          ) : (
            filteredQueue.map((item) => {
              const isItemBusy = isPending && activeItemId === item.id;
              const isHighRisk = item.riskLevel === 'HIGH';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  whileHover={{ y: -2 }}
                  className="group rounded-3xl p-6 bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 space-y-5"
                >
                  {/* Top Bar: Title, Badges, Author */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isHighRisk
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : item.riskLevel === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isHighRisk && <AlertTriangle className="w-3.5 h-3.5" />}
                          {!isHighRisk && item.riskLevel === 'LOW' && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          {item.riskLevel} RISK
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-muted)] font-medium">
                          <Building2 className="w-3 h-3" />
                          {item.department}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <User className="w-3 h-3" />
                          {item.creator}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Pending Status Tag */}
                    <div className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] self-start sm:self-auto bg-[var(--background)] px-3 py-1 rounded-xl border border-[var(--border)]">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Pending Approval
                    </div>
                  </div>

                  {/* Body Text Content Preview */}
                  <div className="rounded-2xl p-4 bg-[var(--background)] border border-[var(--border)]">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Submitted Copy Draft
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-[var(--text)]">
                      &ldquo;{item.bodyText}&rdquo;
                    </p>
                  </div>

                  {/* Issues Section */}
                  {item.issues && item.issues.length > 0 ? (
                    <div className="space-y-2 rounded-2xl p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        {item.issues.length} Flagged Governance Violation
                        {item.issues.length > 1 ? 's' : ''}
                      </div>
                      {item.issues.map((issue) => (
                        <div
                          key={issue.id}
                          className="text-xs space-y-1 pt-1.5 border-t border-amber-500/15 first:border-0 first:pt-0"
                        >
                          <p className="text-[var(--text)] font-semibold">
                            {issue.explanation}
                          </p>
                          <div className="text-[var(--text-muted)] flex items-start gap-1.5">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Suggested Fix:
                            </span>
                            <span>{issue.suggestedFix}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                      Zero policy violations detected. Content is verified and ready for production release.
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
                    <Link
                      href="/dashboard/review"
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      Open in Interactive Editor
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleReject(item)}
                        disabled={isItemBusy}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--background)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        Request Revisions
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApprove(item)}
                        disabled={isItemBusy}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#123B2F] hover:bg-[#184e3e] dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                      >
                        {isItemBusy ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                        )}
                        <span>Approve & Release</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
