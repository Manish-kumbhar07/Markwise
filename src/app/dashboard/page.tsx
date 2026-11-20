export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Phase 2 Active
            </div>
            <h1 className="text-2xl font-bold font-serif tracking-tight text-[var(--text)]">
              Enterprise Brand Governance
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Deterministic rule codex, verified fact anchors, and causal explainability for all marketing copy.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Status Cards to preview theme tokens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xs transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Active Rules
          </div>
          <div className="mt-2 text-3xl font-bold text-[var(--text)]">24</div>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            100% Policy Coverage
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xs transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Verified Facts
          </div>
          <div className="mt-2 text-3xl font-bold text-[var(--text)]">18</div>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Anchored to Evidence
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xs transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Compliance Score
          </div>
          <div className="mt-2 text-3xl font-bold text-[#123B2F] dark:text-emerald-400">
            98.4%
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Across 142 reviewed drafts
          </p>
        </div>
      </div>
    </div>
  );
}
