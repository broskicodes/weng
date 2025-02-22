"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, BookStatus } from '@/utils/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditBookDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditBookDialog({ book, open, onOpenChange }: EditBookDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      goodreadsUrl: formData.get('goodreadsUrl') as string,
      status: formData.get('status') as BookStatus,
      learning: formData.get('learning') as string,
      coverUrl: book.coverUrl,
    };

    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update book details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={book.title}
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
              defaultValue={book.author}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="goodreadsUrl" className="block font-medium">
              Goodreads URL
            </label>
            <input
              type="url"
              id="goodreadsUrl"
              name="goodreadsUrl"
              defaultValue={book.goodreadsUrl}
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
              defaultValue={book.status}
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
              defaultValue={book.learning}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 