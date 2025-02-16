import { db } from '@/utils/db/config';
import { projects, projectDetails } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const detailsSchema = z.object({
  cost: z.string(),
  buildTime: z.string(),
  difficulty: z.enum(['novice', 'intermediate', 'cracked']),
  writeUp: z.string(),
  youtubeUrl: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const validatedBody = detailsSchema.parse(body);

    const project = await db.select().from(projects).where(eq(projects.slug, slug));
    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete existing details if any
    await db.delete(projectDetails).where(eq(projectDetails.projectId, project[0].id));

    // Insert new details
    const result = await db.insert(projectDetails).values({
      projectId: project[0].id,
      ...validatedBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update project details' }, { status: 500 });
  }
} 