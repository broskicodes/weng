import { db } from '@/utils/db/config';
import { books } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await request.json();
    const [updated] = await db
      .update(books)
      .set(book)
      .where(eq(books.id, params.id))
      .returning();
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
} 