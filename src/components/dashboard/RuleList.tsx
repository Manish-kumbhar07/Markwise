'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Plus,
  AlertTriangle,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Sparkles,
  Layers,
  Calendar,
  Tag,
  Loader2,
} from 'lucide-react';
import { createRule, deleteRule, type CreateRuleInput } from '@/app/actions/rules';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export interface RuleItem {
  id: string;
  workspaceId: string;
  title: string;
  severity: string;
  type: string;
  definition: string;
  version: number;
  currentVersion?: number;
  createdAt: Date | string;
}

interface RuleListProps {
  initialRules: RuleItem[];
}

export function RuleList({ initialRules }: RuleListProps) {
  const router = useRouter();
  const [rules, setRules] = useState<RuleItem[]>(initialRules);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [title, setTitle] = useState('');
  const [definition, setDefinition] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [type, setType] = useState('TERMINOLOGY');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a descriptive rule title.');
      return;
    }
    if (!definition.trim()) {
      setFormError('Please enter the rule enforcement definition.');
      return;
    }

    startTransition(async () => {
      try {
        const input: CreateRuleInput = {
          title: title.trim(),
          definition: definition.trim(),
          severity,
          type,
        };
        const created = await createRule(input);
        
        // Optimistically prepend new rule
        setRules((prev) => [created as RuleItem, ...prev]);

        // Reset form & close dialog
        setTitle('');
        setDefinition('');
        setSeverity('MEDIUM');
        setType('TERMINOLOGY');
        setIsDialogOpen(false);

        router.refresh();
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : 'Failed to create rule.');
      }
    });
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand rule?')) return;

    startTransition(async () => {
      try {
        await deleteRule(id);
        setRules((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Failed to delete rule.');
      }
    });
  };

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.title.toLowerCase().includes(search.toLowerCase()) ||
      rule.definition.toLowerCase().includes(search.toLowerCase()) ||
      rule.type.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity =
      severityFilter === 'ALL' || rule.severity.toUpperCase() === severityFilter;
    return matchesSearch && matchesSeverity;
  });

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
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Deterministic Policy Codex</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] font-serif">
            Brand Rules Engine
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">
            Define enforceable tone constraints, statutory disclaimers, and prohibited claim terminology.
          </p>
        </div>

        {/* Create Rule Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#123B2F] dark:bg-emerald-500 hover:bg-[#1A4C3E] dark:hover:bg-emerald-400 text-white dark:text-gray-950 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Rule</span>
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Brand Governance Rule</DialogTitle>
              <DialogDescription>
                Codify a new policy constraint to be automatically checked across all drafts.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateRule} className="space-y-4 pt-2">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Rule Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prohibited Absolute Security Claims"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#123B2F] dark:focus:ring-emerald-400 transition-colors"
                />
              </div>

              {/* Severity & Type Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Severity Tier
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[#123B2F] dark:focus:ring-emerald-400 cursor-pointer"
                  >
                    <option value="HIGH">HIGH (Blocking)</option>
                    <option value="MEDIUM">MEDIUM (Warning)</option>
                    <option value="LOW">LOW (Stylistic)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Rule Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[#123B2F] dark:focus:ring-emerald-400 cursor-pointer"
                  >
                    <option value="TERMINOLOGY">Terminology</option>
                    <option value="LEGAL">Legal Compliance</option>
                    <option value="TONE">Brand Voice & Tone</option>
                    <option value="STYLE">Editorial Style</option>
                  </select>
                </div>
              </div>

              {/* Enforcement Definition Textarea */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Enforcement Constraint & Explanation
                </label>
                <textarea
                  rows={3}
                  required
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  placeholder="Explain exactly what is prohibited, why it matters, and how to fix it..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#123B2F] dark:focus:ring-emerald-400 transition-colors resize-none"
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--card)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-[#123B2F] dark:bg-emerald-500 hover:bg-[#1A4C3E] dark:hover:bg-emerald-400 text-white dark:text-gray-950 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isPending ? 'Saving...' : 'Save Rule'}</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rules by keyword, category, or definition..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#123B2F] dark:focus:ring-emerald-400 transition-all shadow-2xs"
          />
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xs">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSeverityFilter(tier)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                severityFilter === tier
                  ? 'bg-[#123B2F] dark:bg-emerald-500 text-white dark:text-gray-950 shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Rules Grid with Framer Motion AnimatePresence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRules.map((rule) => (
            <motion.div
              key={rule.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Card Header: Badges & Version */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(
                        rule.severity
                      )}`}
                    >
                      {rule.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)]">
                      {rule.type}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--background)] text-[var(--text-muted)] border border-[var(--border)]">
                    v{rule.currentVersion || rule.version || 1}.0
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[var(--text)] font-serif group-hover:text-[#123B2F] dark:group-hover:text-emerald-400 transition-colors">
                  {rule.title}
                </h3>

                {/* Definition */}
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                  {rule.definition}
                </p>
              </div>

              {/* Card Footer: Metadata & Delete */}
              <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(rule.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteRule(rule.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-500/10 transition-all cursor-pointer"
                  title="Delete Rule"
                  aria-label="Delete Rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRules.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text)] font-serif">
              No brand rules found
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              {search
                ? `No rules matched your search query "${search}".`
                : 'Get started by creating your organization’s first brand rule codex.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RuleList;
