import { db } from '@/utils/db/config';
import { projects, projectProgress } from '@/utils/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;
  try {
    const project = await db.select().from(projects).where(eq(projects.slug, slug));
    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updates = await db
      .select()
      .from(projectProgress)
      .where(eq(projectProgress.projectId, project[0].id))
      .orderBy(desc(projectProgress.completedAt));

    return NextResponse.json(updates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch project updates' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const { slug } = await params;
  try {
    const [{ id }] = await db.select().from(projects).where(eq(projects.slug, slug));
    if (!id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const update = formData.get('update') as string;
    const description = formData.get('description') as string;
    const media = formData.get('media') as string | null;
    const completedAt = formData.get('completedAt') as string;

    if (!update || !description || !completedAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newUpdate = await db.insert(projectProgress).values({
      projectId: id,
      update,
      description,
      mediaKey: media || null,
      completedAt: new Date(completedAt),
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newUpdate[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create project update' }, { status: 500 });
  }
} 