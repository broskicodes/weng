import Link from 'next/link';
import { Book, BookStatus } from '@/utils/types';
import CreateBookDialog from '@/components/CreateBookDialog';
import BookCard from '@/components/BookCard';

async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/books`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export default async function ReadingList() {
  const books = await getBooks();
  
  const sections: { status: BookStatus; title: string }[] = [
    { status: 'reading', title: 'Reading' },
    { status: 'read', title: 'Read' },
    { status: 'to_read', title: 'To Read' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back home
          </Link>
          {process.env.NODE_ENV === 'development' && (
            <CreateBookDialog />
          )}
        </div>
        <h1 className="text-4xl font-space font-bold">Reading List</h1>
        <p className="text-gray-600">Books that have shaped my philosophy and approach to work.</p>
      </div>

      <div className="space-y-12">
        {sections.map(({ status, title }) => {
          const sectionBooks = books
            .filter(book => book.status === status)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          if (sectionBooks.length === 0) return null;
          
          return (
            <section key={status} className="space-y-4">
              <h2 className="text-2xl font-space font-bold text-gray-800">{title}</h2>
              <div className="flex flex-col gap-2">
                {sectionBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
} 