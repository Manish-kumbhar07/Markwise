import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';
import { ReviewView } from '@/components/dashboard/ReviewView';
import { type ReviewContentResult } from '@/app/actions/review';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const { workspaceId } = await requireUserWorkspace();

  const content = await prisma.content.findFirst({
    where: { workspaceId },
    include: { issues: { include: { rule: true }, orderBy: { id: 'asc' } } },
    orderBy: { id: 'desc' },
  });

  const reviewContent: ReviewContentResult = content
    ? {
        id: content.id,
        title: content.title,
        bodyText: content.bodyText,
        status: content.status,
        issues: content.issues.map((iss) => ({
          id: iss.id,
          contentId: iss.contentId,
          ruleId: iss.ruleId,
          ruleTitle: iss.rule?.title || 'Brand Rule',
          severity: iss.severity,
          why: iss.explanation,
          suggestedFix: iss.suggestedFix,
          status: iss.status,
          aiAssisted: iss.aiAssisted,
        })),
      }
    : {
        id: '',
        title: '',
        bodyText: '',
        status: 'DRAFT',
        issues: [],
      };

  return <ReviewView initialContent={reviewContent} />;
}
