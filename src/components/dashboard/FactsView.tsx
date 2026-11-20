'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createFact, deleteFact } from '@/app/actions/facts';
import {
  Database,
  ShieldCheck,
  Plus,
  Trash2,
  Calendar,
  FileCheck2,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
  X,
} from 'lucide-react';

interface FactItem {
  id: string;
  claim: string;
  evidenceSource: string;
  expiryDate: Date | string;
  status: string;
}

interface FactsViewProps {
  initialFacts: FactItem[];
}

export function FactsView({ initialFacts }: FactsViewProps) {
  const [facts, setFacts] = useState<FactItem[]>(initialFacts);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claim, setClaim] = useState('');
  const [evidenceSource, setEvidenceSource] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [isPending, startTransition] = useTransition();

  const filteredFacts = facts.filter(
    (f) =>
      f.claim.toLowerCase().includes(search.toLowerCase()) ||
      f.evidenceSource.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim() || !evidenceSource.trim()) return;

    startTransition(async () => {
      try {
        const newFact = await createFact({
          claim,
          evidenceSource,
          expiryDate: new Date(expiryDate),
        });
        setFacts((prev) => [newFact, ...prev]);
        setClaim('');
        setEvidenceSource('');
        setIsModalOpen(false);
      } catch (err) {
        console.error('Failed to create fact:', err);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteFact(id);
        setFacts((prev) => prev.filter((f) => f.id !== id));
      } catch (err) {
        console.error('Failed to delete fact:', err);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
            <Database className="w-3.5 h-3.5" />
            Verified Knowledge Base
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Fact Vault & Evidence Anchors
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Audited performance claims, compliance attestations, and statutory certifications for copy verification.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123B2F] hover:bg-[#184e3e] dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Anchor New Fact
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search claims or evidence citations..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#123B2F]/20 dark:focus:ring-emerald-400/20 transition-all"
        />
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredFacts.map((fact) => (
            <motion.div
              key={fact.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              whileHover={{ y: -2 }}
              className="group p-5 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {fact.status}
                  </span>
                  <button
                    onClick={() => handleDelete(fact.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-500 p-1 rounded-lg transition-all"
                    title="Remove Fact Anchor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold tracking-tight text-[var(--text)] leading-snug">
                  &ldquo;{fact.claim}&rdquo;
                </h3>
              </div>

              <div className="pt-3 border-t border-[var(--border)] space-y-2">
                <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span className="font-semibold text-[var(--text)]">
                    Evidence:
                  </span>
                  <span className="line-clamp-1">{fact.evidenceSource}</span>
                </div>

                <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Valid until:</span>
                  <span className="font-medium text-[var(--text)]">
                    {new Date(fact.expiryDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Fact Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl p-6 bg-[var(--card)] border border-[var(--border)] shadow-2xl space-y-5 text-[var(--text)]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-lg font-bold tracking-tight">
                    Anchor New Fact
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Verifiable Claim Statement
                  </label>
                  <textarea
                    rows={3}
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    placeholder="e.g. 99.99% Uptime SLA guaranteed with multi-region failover"
                    required
                    className="w-full p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#123B2F]/20 dark:focus:ring-emerald-400/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Evidence Source / Audit Attestation
                  </label>
                  <input
                    type="text"
                    value={evidenceSource}
                    onChange={(e) => setEvidenceSource(e.target.value)}
                    placeholder="e.g. SOC 2 Type II Security Report (PwC 2026 Audit)"
                    required
                    className="w-full p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#123B2F]/20 dark:focus:ring-emerald-400/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[#123B2F]/20 dark:focus:ring-emerald-400/20"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl bg-[#123B2F] hover:bg-[#184e3e] dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                  >
                    {isPending ? 'Anchoring...' : 'Save & Anchor'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
