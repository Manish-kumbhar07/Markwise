'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Loader2,
  RotateCcw,
  Check,
  Copy,
  Info,
  BookOpen,
} from 'lucide-react';
import {
  runAIReview,
  saveDraftContent,
  type ReviewContentResult,
  type ReviewIssueResult,
} from '@/app/actions/review';

interface ReviewViewProps {
  initialContent: ReviewContentResult;
}

const DEFAULT_SAMPLE_COPY =
  'Markwise guarantees 100% unbreakable security and absolute zero risk across all cloud deployments. Our revolutionary enterprise architecture is 10x faster than legacy manual review tools with zero latency guarantees under 1ms.';

export function ReviewView({ initialContent }: ReviewViewProps) {
  const [contentId] = useState(initialContent.id);
  const [title, setTitle] = useState(initialContent.title || 'Enterprise Cloud Launch Announcement');
  const [bodyText, setBodyText] = useState(initialContent.bodyText || DEFAULT_SAMPLE_COPY);
  const [issues, setIssues] = useState<ReviewIssueResult[]>(initialContent.issues || []);
  const [isPending, startTransition] = useTransition();
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const characterCount = bodyText.length;
  const wordCount = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0;

  const handleRunReview = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const detected = await runAIReview(contentId, bodyText, title);
        setIssues(detected);
        if (detected.length === 0) {
          setStatusMessage('Clean draft! Zero policy violations detected.');
        } else {
          setStatusMessage(`Review complete: ${detected.length} policy issue${detected.length > 1 ? 's' : ''} flagged.`);
        }
      } catch (err: unknown) {
        setStatusMessage(err instanceof Error ? err.message : 'Failed to complete AI review.');
      }
    });
  };

  const handleApplyFix = (issue: ReviewIssueResult) => {
    if (!issue.suggestedFix) return;

    // Apply the suggested fix to the bodyText
    let updatedText = bodyText;
    if (issue.why.toLowerCase().includes('100%') || issue.why.toLowerCase().includes('zero risk')) {
      updatedText = updatedText.replace(
        /100% unbreakable security and absolute zero risk across all cloud deployments/gi,
        issue.suggestedFix
      );
    } else if (issue.why.toLowerCase().includes('10x') || issue.why.toLowerCase().includes('latency')) {
      updatedText = updatedText.replace(
        /10x faster than legacy manual review tools with zero latency guarantees under 1ms/gi,
        issue.suggestedFix
      );
    } else if (issue.why.toLowerCase().includes('revolutionary')) {
      updatedText = updatedText.replace(/revolutionary enterprise architecture/gi, issue.suggestedFix);
    } else {
      // General replacement or append
      updatedText = `${updatedText}\n\n[Compliant Revision]: ${issue.suggestedFix}`;
    }

    setBodyText(updatedText);
    setAppliedFixes((prev) => ({ ...prev, [issue.id]: true }));

    // Persist updated draft
    saveDraftContent(contentId, updatedText, title).catch(console.error);
  };

  const handleResetSample = () => {
    setBodyText(DEFAULT_SAMPLE_COPY);
    setAppliedFixes({});
    setStatusMessage(null);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'LOW':
      default:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Review Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] font-serif">
            Content Pre-Publish Review
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Real-time causal analysis against your active Brand Rules and Fact Vault evidence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetSample}
            className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background)] text-xs font-semibold text-[var(--text)] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Reset to sample violating copy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample</span>
          </button>

          {/* 3. Run AI Review Button with Framer Motion Sage Glow */}
          <motion.button
            type="button"
            onClick={handleRunReview}
            disabled={isPending || !bodyText.trim()}
            animate={
              isPending
                ? {
                    boxShadow: [
                      '0 0 0px rgba(16,185,129,0)',
                      '0 0 24px rgba(16,185,129,0.6)',
                      '0 0 0px rgba(16,185,129,0)',
                    ],
                  }
                : {}
            }
            transition={
              isPending
                ? {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'easeInOut',
                  }
                : {}
            }
            whileHover={!isPending ? { scale: 1.02 } : {}}
            whileTap={!isPending ? { scale: 0.98 } : {}}
            className="relative px-6 py-2.5 rounded-xl bg-[#123B2F] dark:bg-emerald-500 hover:bg-[#1A4C3E] dark:hover:bg-emerald-400 text-white dark:text-gray-950 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400 dark:text-gray-950" />
                <span>Analyzing Policies &amp; Evidence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Review</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 2. Split Screen Layout: 60% Editor (3 cols), 40% Issues Panel (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* LEFT COLUMN: Editor (60%) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4 transition-colors">
            {/* Draft Title Input */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Draft Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter draft headline..."
                className="w-full text-lg sm:text-xl font-bold font-serif text-[var(--text)] bg-transparent border-b border-[var(--border)] focus:outline-none focus:border-[#123B2F] dark:focus:border-emerald-400 py-1 transition-colors"
              />
            </div>

            {/* Editor Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[var(--text)]">
                  Marketing Draft Copy
                </label>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{characterCount} / 5000 chars</span>
                </div>
              </div>

              <textarea
                rows={12}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Paste or write your marketing copy here to evaluate against active brand policies..."
                className="w-full p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#123B2F] dark:focus:ring-emerald-400 transition-colors leading-relaxed resize-y font-sans shadow-inner"
              />
            </div>

            {/* Quick Context Helper */}
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Deterministic pre-publish verification</span>
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--background)] border border-[var(--border)]">
                Target: Enterprise Web
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Issues Panel (40%) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4 transition-colors">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#F47745]" />
                <h3 className="text-base font-bold text-[var(--text)] font-serif">
                  Detected Policy Issues
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F47745]/10 text-[#F47745] border border-[#F47745]/20">
                {issues.length} Flag{issues.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* 4. Issue Cards with AnimatePresence (Slide in from right) */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {issues.map((issue, index) => {
                  const isFixed = !!appliedFixes[issue.id];

                  return (
                    <motion.div
                      key={issue.id}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 26,
                        delay: index * 0.08,
                      }}
                      className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                        isFixed
                          ? 'bg-emerald-500/5 border-emerald-500/25 opacity-75'
                          : 'bg-[var(--background)]/70 hover:bg-[var(--background)] border-[var(--border)] shadow-xs'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(
                            issue.severity
                          )}`}
                        >
                          {issue.severity}
                        </span>

                        <span className="text-xs font-semibold text-[var(--text)] truncate max-w-[200px]">
                          {issue.ruleTitle || 'Brand Constraint'}
                        </span>
                      </div>

                      {/* Explanation (Why) */}
                      <p className="text-xs text-[var(--text)] leading-relaxed">
                        {issue.why}
                      </p>

                      {/* Suggested Compliant Fix Box */}
                      {issue.suggestedFix && (
                        <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <Sparkles className="w-3 h-3" />
                              <span>1-Click Suggested Fix</span>
                            </span>
                          </div>

                          <p className="text-xs font-mono text-[var(--text)] leading-relaxed bg-[var(--background)]/80 p-2.5 rounded-lg border border-[var(--border)]">
                            &quot;{issue.suggestedFix}&quot;
                          </p>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleApplyFix(issue)}
                              disabled={isFixed}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isFixed
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 cursor-default'
                                  : 'bg-[#123B2F] dark:bg-emerald-500 hover:bg-[#1A4C3E] dark:hover:bg-emerald-400 text-white dark:text-gray-950 shadow-2xs active:scale-95'
                              }`}
                            >
                              {isFixed ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Applied to Draft</span>
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                  <span>Apply Fix</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Clean Empty State */}
              {issues.length === 0 && !isPending && (
                <div className="p-8 text-center rounded-2xl bg-[var(--background)]/50 border border-dashed border-[var(--border)] space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--text)]">
                    No Policy Flags Detected
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
                    Click &quot;Run AI Review&quot; to scan the current draft against active rules and evidence anchors.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewView;
