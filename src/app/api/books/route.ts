import { db } from '@/utils/db/config';
import { books } from '@/utils/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allBooks = await db.select().from(books).orderBy(desc(books.createdAt));
    return NextResponse.json(allBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const book = await request.json();
    const [newBook] = await db.insert(books).values(book).returning();
    return NextResponse.json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
} 