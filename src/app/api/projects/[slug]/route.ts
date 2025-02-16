import { db } from '@/utils/db/config';
import { projects, projectDetails } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('include') === 'details';

    const query = includeDetails 
      ? db.select({
          id: projects.id,
          title: projects.title,
          description: projects.description,
          mediaKey: projects.mediaKey,
          slug: projects.slug,
          purchaseLink: projects.purchaseLink,
          status: projects.status,
          createdAt: projects.createdAt,
          updatedAt: projects.updatedAt,
          details: {
            writeUp: projectDetails.writeUp,
            difficulty: projectDetails.difficulty,
            cost: projectDetails.cost,
            buildTime: projectDetails.buildTime,
          }
        })
        .from(projects)
        .leftJoin(projectDetails, eq(projects.id, projectDetails.projectId))
        .where(eq(projects.slug, slug))
      : db.select()
        .from(projects)
        .where(eq(projects.slug, slug));

    const data = await query;
    
    if (!data.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
} 