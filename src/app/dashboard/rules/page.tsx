import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';
import { BrandBrainPage } from '@/components/dashboard/BrandBrainPage';
import type { RuleCard, RuleType, RuleSeverity } from '@/utils/dashboard';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
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
}
