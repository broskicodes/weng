"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookStatus } from '@/utils/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookInfo {
  title?: string;
  author?: string;
  coverUrl?: string;
  isbnUsed?: string;
}

export default function CreateBookDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [manualInput, setManualInput] = useState(false);
  const router = useRouter();

  async function fetchBookInfo(isbn: string) {
    // Remove any hyphens or spaces
    isbn = isbn.replace(/[-\s]/g, '');
    
    // Only proceed if we have a valid ISBN length
    if (isbn.length !== 10 && isbn.length !== 13) return;
    
    setIsLoading(true);
    setManualInput(false);

    try {
      // Try ISBN-10 first
      let res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
      let finalIsbn = isbn;
      
      // If ISBN-10 fails and we have ISBN-13, try converting to ISBN-10
      if (!res.ok && isbn.length === 13) {
        const isbn10 = isbn.substring(3, 12);
        // Calculate ISBN-10 check digit
        let checksum = 0;
        for (let i = 0; i < 9; i++) {
          checksum += (10 - i) * parseInt(isbn10[i]);
        }
        checksum = (11 - (checksum % 11)) % 11;
        finalIsbn = isbn10 + (checksum === 10 ? 'X' : checksum.toString());
        
        res = await fetch(`https://openlibrary.org/isbn/${finalIsbn}.json`);
      }

      if (!res.ok) {
        setManualInput(true);
        setBookInfo({ isbnUsed: isbn });
        return;
      }

      const data = await res.json();
      let authorName;
      
      try {
        if (data.authors?.[0]?.key) {
          const authorRes = await fetch(`https://openlibrary.org${data.authors[0].key}.json`);
          if (authorRes.ok) {
            const authorData = await authorRes.json();
            authorName = authorData.name;
          }
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
      
      setBookInfo({
        title: data.title,
        author: authorName,
        coverUrl: `https://covers.openlibrary.org/b/isbn/${finalIsbn}-L.jpg`,
        isbnUsed: finalIsbn
      });

      if (!data.title || !authorName) setManualInput(true);
    } catch (error) {
      console.error('Error fetching book:', error);
      setManualInput(true);
      setBookInfo(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      title: manualInput ? formData.get('title') as string : bookInfo?.title,
      author: manualInput ? formData.get('author') as string : bookInfo?.author,
      goodreadsUrl: formData.get('goodreadsUrl') as string,
      status: formData.get('status') as BookStatus,
      learning: formData.get('learning') as string,
      coverUrl: bookInfo?.coverUrl,
    };

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating book:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setBookInfo(null);
        setManualInput(false);
      }
    }}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
          Add Book
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Enter ISBN-10 or ISBN-13 to fetch book details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="isbn" className="block font-medium">
              ISBN
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="isbn"
                name="isbn"
                placeholder="Enter ISBN-10 or ISBN-13"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={(e) => e.target.value.length >= 10 && fetchBookInfo(e.target.value)}
              />
            </div>
            {isLoading && <p className="text-sm text-gray-600">Loading book info...</p>}
            {bookInfo && !manualInput && (
              <div className="text-sm text-gray-600">
                Found: {bookInfo.title} by {bookInfo.author}
              </div>
            )}
          </div>

          {manualInput && (
            <>
              <div className="space-y-2">
                <label htmlFor="title" className="block font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={bookInfo?.title}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="author" className="block font-medium">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  defaultValue={bookInfo?.author}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label htmlFor="goodreadsUrl" className="block font-medium">
              Goodreads URL
            </label>
            <input
              type="url"
              id="goodreadsUrl"
              name="goodreadsUrl"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="to_read">To Read</option>
              <option value="reading">Reading</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="learning" className="block font-medium">
              Learning
            </label>
            <textarea
              id="learning"
              name="learning"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Book'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 