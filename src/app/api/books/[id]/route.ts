import { db } from '@/utils/db/config';
import { books } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await request.json();
    const [updated] = await db
      .update(books)
      .set(book)
      .where(eq(books.id, id))
      .returning();
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
} 