'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';

export interface ApprovalIssueItem {
  id: string;
  severity: string;
  explanation: string;
  suggestedFix: string;
}

export interface ApprovalContentItem {
  id: string;
  title: string;
  bodyText: string;
  originalText: string;
  status: string;
  creator: string;
  department: string;
  issuesCount: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  issues: ApprovalIssueItem[];
}

function deriveOriginalText(currentBody: string): string {
  return currentBody;
}

export async function getApprovalQueue(): Promise<ApprovalContentItem[]> {
  const { workspaceId, userEmail } = await requireUserWorkspace();

  let contents = await prisma.content.findMany({
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

  // Seed default demo pending reviews if the queue is empty
  if (contents.length === 0) {
    try {
      await prisma.content.create({
        data: {
          workspaceId,
          title: 'Q4 Enterprise Cloud Infrastructure Launch Release',
          bodyText: 'Markwise guarantees 100% unbreakable security with enterprise-grade encryption and audited SOC 2 Type II assurance.',
          status: 'IN_REVIEW',
          issues: {
            create: [
              {
                severity: 'HIGH',
                explanation: 'Absolute guarantee flagged: "100% unbreakable security" violates FTC truth-in-advertising guidelines.',
                suggestedFix: 'Replace with "multi-layered cryptographic architecture and audited SOC 2 Type II compliance".',
                status: 'OPEN',
              },
            ],
          },
        },
      });

      await prisma.content.create({
        data: {
          workspaceId,
          title: 'Global Performance Benchmark Whitepaper (2026)',
          bodyText: 'Independent benchmark audits confirm verified uptime and consistent SLA metrics across all cloud regions.',
          status: 'IN_REVIEW',
          issues: {
            create: [],
          },
        },
      });

      contents = await prisma.content.findMany({
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
    } catch (e) {
      console.warn('Could not auto-seed pending items:', e);
    }
  }

  return contents.map((c, index) => {
    const hasHighIssue = c.issues.some((i) => i.severity === 'HIGH');
    const hasMediumIssue = c.issues.some((i) => i.severity === 'MEDIUM');

    return {
      id: c.id,
      title: c.title,
      bodyText: c.bodyText,
      originalText: deriveOriginalText(c.bodyText),
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
}

export async function updateContentStatus(
  contentId: string,
  status: 'APPROVED' | 'REJECTED' | 'IN_REVIEW'
): Promise<void> {
  const { workspaceId } = await requireUserWorkspace();

  const content = await prisma.content.findFirst({
    where: { id: contentId, workspaceId },
  });

  if (!content) {
    throw new Error('Content not found or unauthorized.');
  }

  await prisma.content.update({
    where: { id: contentId },
    data: { status },
  });

  revalidatePath('/dashboard/approvals');
  revalidatePath('/dashboard/review');
  revalidatePath('/dashboard/insights');
}

export async function approveContent(contentId: string): Promise<void> {
  return updateContentStatus(contentId, 'APPROVED');
}

export async function rejectContent(contentId: string): Promise<void> {
  return updateContentStatus(contentId, 'REJECTED');
}

export async function resetApprovalQueue(): Promise<void> {
  const { workspaceId } = await requireUserWorkspace();

  // Reset demo contents to IN_REVIEW
  await prisma.content.updateMany({
    where: { workspaceId },
    data: { status: 'IN_REVIEW' },
  });

  revalidatePath('/dashboard/approvals');
}
