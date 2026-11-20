import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';
import { ApprovalsView } from '@/components/dashboard/ApprovalsView';
import type { ApprovalContentItem } from '@/app/actions/approvals';

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const { workspaceId, userEmail } = await requireUserWorkspace();

  const contents = await prisma.content.findMany({
    where: {
      workspaceId,
      status: 'IN_REVIEW',
    },
    include: {
      issues: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const queue: ApprovalContentItem[] = contents.map((c, index) => {
    const hasHighIssue = c.issues.some((i) => i.severity === 'HIGH');
    const hasMediumIssue = c.issues.some((i) => i.severity === 'MEDIUM');

    return {
      id: c.id,
      title: c.title,
      bodyText: c.bodyText,
      originalText: c.bodyText,
      status: c.status,
      creator: index === 0 ? userEmail.split('@')[0] : 'Compliance Reviewer',
      department: index === 0 ? 'Product Marketing' : 'Global Communications',
      issuesCount: c.issues.length,
      riskLevel: hasHighIssue ? 'HIGH' : hasMediumIssue ? 'MEDIUM' : 'LOW',
      issues: c.issues.map((iss) => ({
        id: iss.id,
        severity: iss.severity,
        explanation: iss.explanation,
        suggestedFix: iss.suggestedFix,
      })),
    };
  });

  return <ApprovalsView initialQueue={queue} />;
}
