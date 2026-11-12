import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserWorkspace } from '@/lib/workspace';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { workspaceId } = await requireUserWorkspace();

    const rules = await prisma.rule.findMany({
      where: { workspaceId },
      select: {
        id: true,
        title: true,
        type: true,
        severity: true,
        definition: true,
        version: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rules);
  } catch (err: unknown) {
    console.error('[API /api/rules GET error]:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch rules' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { workspaceId } = await requireUserWorkspace();
    const body = await request.json();

    const title = (body.title || '').trim();
    const definition = (body.definition || '').trim();
    const severity = (body.severity || 'HIGH').toUpperCase();
    const type = (body.type || 'TERMINOLOGY').toUpperCase();

    if (!title || !definition) {
      return NextResponse.json(
        { error: 'Rule title and definition are required.' },
        { status: 400 }
      );
    }

    const cleanSeverity = severity === 'HIGH' ? 'HIGH' : severity === 'LOW' ? 'LOW' : 'MEDIUM';

    const rule = await prisma.rule.create({
      data: {
        workspaceId,
        title,
        definition,
        severity: cleanSeverity,
        type,
        version: 1,
      },
      select: {
        id: true,
        title: true,
        type: true,
        severity: true,
        definition: true,
        version: true,
        createdAt: true,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (err: unknown) {
    console.error('[API /api/rules POST error]:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create rule' },
      { status: 500 }
    );
  }
}
