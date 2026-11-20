import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';
import { RuleList } from '@/components/dashboard/RuleList';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const { workspaceId } = await requireUserWorkspace();

  let rules = await prisma.rule.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
  });

  // Seed default rules if workspace has none yet
  if (rules.length === 0) {
    await prisma.rule.createMany({
      data: [
        {
          workspaceId,
          title: 'Prohibited Absolute Performance Claims',
          severity: 'HIGH',
          type: 'TERMINOLOGY',
          definition:
            'Never claim "100% unbreakable uptime" or "zero risk" without verified legal disclaimer citing SLA Exhibit B.',
          version: 1,
          currentVersion: 1,
        },
        {
          workspaceId,
          title: 'Unsubstantiated Benchmark Multipliers',
          severity: 'MEDIUM',
          type: 'LEGAL',
          definition:
            'All comparative claims (e.g., "10x faster than legacy") must anchor to certified third-party benchmark evaluations in the Fact Vault.',
          version: 1,
          currentVersion: 1,
        },
        {
          workspaceId,
          title: 'Authoritative Enterprise Tone',
          severity: 'LOW',
          type: 'TONE',
          definition:
            'Maintain a measured, defensible B2B voice. Avoid hyperbolic consumer marketing buzzwords like "magic", "miracle", or "revolutionary".',
          version: 1,
          currentVersion: 1,
        },
      ],
    });

    rules = await prisma.rule.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  return <RuleList initialRules={rules} />;
}
