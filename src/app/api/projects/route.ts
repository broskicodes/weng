import { db } from '@/utils/db/config';
import { projects } from '@/utils/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.select().from(projects);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
} 