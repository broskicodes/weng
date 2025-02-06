import { db } from '@/utils/db/config';
import { projects } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await db.select().from(projects).where(eq(projects.slug, params.slug));
    if (!data.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
} 