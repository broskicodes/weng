'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddUpdateDialog({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const res = await fetch(`/api/projects/${slug}/updates`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setOpen(false);
      window.location.reload();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Add Progress Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Progress Update</DialogTitle>
        </DialogHeader>
        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="update" className="block text-sm font-medium">Update Title</label>
            <input
              type="text"
              id="update"
              name="update"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="media" className="block text-sm font-medium">Media Key (optional)</label>
            <input
              type="text"
              id="media"
              name="media"
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="completedAt" className="block text-sm font-medium">Completion Date</label>
            <input
              type="datetime-local"
              id="completedAt"
              name="completedAt"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" className="w-full">Add Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 