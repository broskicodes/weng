import { db } from '@/utils/db/config';
import { projects, projectProgress } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await db.select().from(projects).where(eq(projects.slug, params.slug));
    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updates = await db
      .select()
      .from(projectProgress)
      .where(eq(projectProgress.projectId, project[0].id))
      .orderBy(projectProgress.createdAt);

    return NextResponse.json(updates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project updates' }, { status: 500 });
  }
} 