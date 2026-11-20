import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';
import { RuleList } from '@/components/dashboard/RuleList';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const { workspaceId } = await requireUserWorkspace();

  const rules = await prisma.rule.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
  });

  return <RuleList initialRules={rules} />;
}
