import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';
import { FactsView } from '@/components/dashboard/FactsView';

export const dynamic = 'force-dynamic';

export default async function FactsPage() {
  const { workspaceId } = await requireUserWorkspace();

  const facts = await prisma.fact.findMany({
    where: { workspaceId },
    orderBy: { id: 'desc' },
  });

  return <FactsView initialFacts={facts} />;
}
