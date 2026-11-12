import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';
import { BrandBrainPage } from '@/components/dashboard/BrandBrainPage';
import type { RuleCard, RuleType, RuleSeverity } from '@/utils/dashboard';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  try {
    const { workspaceId } = await requireUserWorkspace();

    const rules = await prisma.rule.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    const initialRules: RuleCard[] = rules.map((r) => ({
      id: r.id,
      title: r.title,
      type: (r.type as RuleType) || 'CLAIM',
      severity: (r.severity as RuleSeverity) || 'HIGH',
      definition: r.definition,
      version: r.version,
      createdAt: `Active · v${r.version ?? 1}`,
    }));

    return <BrandBrainPage initialRules={initialRules} />;
  } catch (error: any) {
    console.error('DASHBOARD ERROR:', error);
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-1">
          <h3 className="font-bold text-sm">Database / Server Error</h3>
          <p className="text-xs font-mono">{error?.message || 'Unknown database error occurred.'}</p>
        </div>
        <BrandBrainPage initialRules={[]} />
      </div>
    );
  }
}
