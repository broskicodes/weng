import { db } from '@/utils/db/config';
import { projects } from '@/utils/db/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  mediaKey: z.string().nullable(),
});

export async function GET() {
  try {
    const data = await db.select().from(projects);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedBody = createProjectSchema.parse(body);

    const result = await db.insert(projects).values({
      ...validatedBody,
      status: 'active',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
} 