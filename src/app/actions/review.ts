'use server';

import { revalidatePath } from 'next/cache';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';
import { requireUserWorkspace, checkRateLimit } from '@/lib/workspace';

export interface ReviewIssueResult {
  id: string;
  contentId: string;
  ruleId: string | null;
  ruleTitle?: string;
  severity: string;
  why: string;
  suggestedFix: string;
  status: string;
  aiAssisted: boolean;
  evidenceSource?: string;
}

export interface ReviewContentResult {
  id: string;
  title: string;
  bodyText: string;
  status: string;
  issues: ReviewIssueResult[];
}

export async function createDraft(input?: { title?: string; bodyText?: string } | FormData): Promise<ReviewContentResult> {
  const { workspaceId } = await requireUserWorkspace();

  let title = 'Untitled Draft';
  let bodyText = '';

  if (input instanceof FormData) {
    title = (input.get('title') as string) || title;
    bodyText = (input.get('bodyText') as string) || bodyText;
  } else if (input) {
    title = input.title || title;
    bodyText = input.bodyText || bodyText;
  }

  const content = await prisma.content.create({
    data: {
      workspaceId,
      title: title.trim(),
      bodyText: bodyText.trim(),
      status: 'DRAFT',
    },
    include: { issues: { include: { rule: true }, orderBy: { id: 'asc' } } },
  });

  revalidatePath('/dashboard/review');

  return {
    id: content.id,
    title: content.title,
    bodyText: content.bodyText,
    status: content.status,
    issues: [],
  };
}

export async function getReviewContent(contentId?: string): Promise<ReviewContentResult> {
  const { workspaceId } = await requireUserWorkspace();

  let content = contentId
    ? await prisma.content.findFirst({
        where: { id: contentId, workspaceId },
        include: { issues: { include: { rule: true }, orderBy: { id: 'asc' } } },
      })
    : await prisma.content.findFirst({
        where: { workspaceId },
        include: { issues: { include: { rule: true }, orderBy: { id: 'asc' } } },
        orderBy: { id: 'desc' },
      });

  if (!content) {
    content = await prisma.content.create({
      data: {
        workspaceId,
        title: 'Untitled Draft',
        bodyText: '',
        status: 'DRAFT',
      },
      include: { issues: { include: { rule: true }, orderBy: { id: 'asc' } } },
    });
  }

  return {
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
  };
}

export async function saveDraftContent(contentId: string, bodyText: string, title?: string) {
  const { workspaceId } = await requireUserWorkspace();

  if (bodyText.length > 5000) {
    throw new Error('Draft payload exceeds maximum allowed size of 5,000 characters.');
  }

  const content = await prisma.content.findFirst({
    where: { id: contentId, workspaceId },
  });

  if (!content) {
    throw new Error('Content not found or unauthorized.');
  }

  const updated = await prisma.content.update({
    where: { id: contentId },
    data: {
      bodyText,
      ...(title ? { title } : {}),
      status: 'DRAFT',
    },
  });

  revalidatePath('/dashboard/review');
  return updated;
}

function fallbackRuleScan(
  bodyText: string,
  rules: Array<{ id: string; title: string; severity: string; type: string; definition: string }>
) {
  const issues: Array<{
    rule_id?: string;
    issue_title?: string;
    why?: string;
    severity?: string;
    suggested_fix?: string;
  }> = [];

  const lower = bodyText.toLowerCase();

  for (const rule of rules) {
    const ruleTitleLower = rule.title.toLowerCase();
    const defLower = rule.definition.toLowerCase();

    if (
      (ruleTitleLower.includes('absolute') || defLower.includes('100%') || defLower.includes('zero risk')) &&
      (lower.includes('100%') || lower.includes('zero risk') || lower.includes('unbreakable'))
    ) {
      issues.push({
        rule_id: rule.id,
        issue_title: rule.title,
        why: 'Statutory exposure under FTC §5: absolute claims of 100% security or zero risk cannot be legally substantiated without qualification.',
        severity: rule.severity || 'HIGH',
        suggested_fix: 'enterprise-grade security with defense-in-depth architecture across cloud deployments',
      });
    } else if (
      (ruleTitleLower.includes('benchmark') || ruleTitleLower.includes('multiplier') || defLower.includes('10x')) &&
      (lower.includes('10x') || lower.includes('fastest') || lower.includes('zero latency'))
    ) {
      issues.push({
        rule_id: rule.id,
        issue_title: rule.title,
        why: 'Unsubstantiated performance comparative: "10x faster" must anchor directly to certified third-party benchmark evaluations in the Fact Vault.',
        severity: rule.severity || 'MEDIUM',
        suggested_fix: 'substantial latency reductions verified in audited enterprise benchmarks (Fact Vault #EV-021)',
      });
    } else if (
      (ruleTitleLower.includes('tone') || ruleTitleLower.includes('voice') || defLower.includes('magic') || defLower.includes('revolutionary')) &&
      (lower.includes('revolutionary') || lower.includes('magic') || lower.includes('miracle'))
    ) {
      issues.push({
        rule_id: rule.id,
        issue_title: rule.title,
        why: 'Prohibited superlative buzzword: "revolutionary" violates authoritative enterprise B2B tone guidelines.',
        severity: rule.severity || 'LOW',
        suggested_fix: 'purpose-built brand governance platform',
      });
    }
  }

  return issues;
}

export async function runAIReview(
  contentId: string,
  currentBodyText?: string,
  currentTitle?: string
): Promise<ReviewIssueResult[]> {
  const { userId, workspaceId } = await requireUserWorkspace();

  // API Rate Limiting: Max 5 requests per minute per user
  const rateLimit = checkRateLimit(`review:${userId}`);
  if (!rateLimit.allowed) {
    throw new Error(
      `Rate limit exceeded: You can only run AI Review 5 times per minute. Please try again in ${rateLimit.retryAfterSeconds} seconds.`
    );
  }

  // Step A: Fetch Content body strictly within this user's workspace
  let content = await prisma.content.findFirst({
    where: { id: contentId, workspaceId },
  });

  if (!content) {
    throw new Error(`Content with ID ${contentId} not found or unauthorized.`);
  }

  // If text or title is passed from client, persist it first
  if (typeof currentBodyText === 'string') {
    content = await prisma.content.update({
      where: { id: contentId },
      data: {
        bodyText: currentBodyText,
        ...(currentTitle ? { title: currentTitle } : {}),
        status: 'DRAFT',
      },
    });
  }

  if (content.bodyText.length > 5000) {
    throw new Error('Draft payload exceeds maximum allowed size of 5,000 characters.');
  }

  // Step B: Fetch active Rule and Fact objects strictly for this workspace
  const [rules, facts] = await Promise.all([
    prisma.rule.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.fact.findMany({
      where: { workspaceId, status: 'ACTIVE' },
    }),
  ]);

  const rulesContext = rules.map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.severity,
    type: r.type,
    definition: r.definition,
  }));

  const factsContext = facts.map((f) => ({
    id: f.id,
    claim: f.claim,
    evidenceSource: f.evidenceSource,
  }));

  // Step C: Initialize the Google Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let parsedIssues: Array<{
    rule_id?: string;
    issue_title?: string;
    why?: string;
    severity?: string;
    suggested_fix?: string;
  }> = [];

  if (apiKey) {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are Markwise, an expert AI brand reviewer. Review this draft: "${content.bodyText}".
Brand Rules: ${JSON.stringify(rulesContext)}.
Evidence Anchors: ${JSON.stringify(factsContext)}.
Return a JSON object with an 'issues' array. Each issue must have:
- rule_id (string or null)
- issue_title (string)
- why (string explaining the violation and citing evidence or lack thereof)
- severity (HIGH, MEDIUM, or LOW)
- suggested_fix (string containing compliant alternative phrasing)
If no issues are found, return { "issues": [] }.`;

    try {
      let geminiResponse;
      try {
        geminiResponse = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
      } catch (err: unknown) {
        geminiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
      }

      const rawJson = geminiResponse.text || '{"issues":[]}';
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed.issues)) {
        parsedIssues = parsed.issues;
      }
    } catch (aiError) {
      console.warn('[AI Review] Gemini API fallback triggered:', aiError);
      parsedIssues = fallbackRuleScan(content.bodyText, rulesContext);
    }
  } else {
    parsedIssues = fallbackRuleScan(content.bodyText, rulesContext);
  }

  // Step E: Parse JSON. Save each issue linked to contentId
  await prisma.issue.deleteMany({
    where: {
      contentId,
      status: 'OPEN',
    },
  });

  const createdIssues: ReviewIssueResult[] = [];

  for (const item of parsedIssues) {
    const matchedRuleId = rules.some((r) => r.id === item.rule_id) ? item.rule_id : null;
    const severityRaw = (item.severity || 'MEDIUM').toUpperCase();
    const cleanSeverity =
      severityRaw === 'HIGH' ? 'HIGH' : severityRaw === 'LOW' ? 'LOW' : 'MEDIUM';

    const issue = await prisma.issue.create({
      data: {
        contentId,
        ruleId: matchedRuleId,
        severity: cleanSeverity,
        explanation: item.why || 'Potential violation of brand compliance standards.',
        suggestedFix: item.suggested_fix || 'Review wording to ensure brand alignment.',
        status: 'OPEN',
        aiAssisted: true,
      },
      include: { rule: true },
    });

    createdIssues.push({
      id: issue.id,
      contentId: issue.contentId,
      ruleId: issue.ruleId,
      ruleTitle: item.issue_title || issue.rule?.title || 'Brand Rule',
      severity: issue.severity,
      why: issue.explanation,
      suggestedFix: issue.suggestedFix,
      status: issue.status,
      aiAssisted: issue.aiAssisted,
    });
  }

  // Step F: Update Content status to "IN_REVIEW"
  await prisma.content.update({
    where: { id: contentId },
    data: { status: 'IN_REVIEW' },
  });

  revalidatePath('/dashboard/review');
  revalidatePath('/dashboard/approvals');
  revalidatePath('/dashboard/insights');

  return createdIssues;
}

export async function acceptIssue(issueId: string, newText: string): Promise<void> {
  const { workspaceId } = await requireUserWorkspace();

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { content: true },
  });

  if (!issue || !issue.content) {
    throw new Error(`Issue with ID ${issueId} not found.`);
  }

  if (issue.content.workspaceId !== workspaceId) {
    throw new Error('Unauthorized: Issue belongs to another workspace.');
  }

  if (newText) {
    await prisma.content.update({
      where: { id: issue.contentId },
      data: { bodyText: newText },
    });
  }

  await prisma.issue.update({
    where: { id: issueId },
    data: { status: 'ACCEPTED' },
  });

  revalidatePath('/dashboard/review');
  revalidatePath('/dashboard/approvals');
  revalidatePath('/dashboard/insights');
}
