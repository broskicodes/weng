"use client";

import { useState } from 'react';
import { Book } from "@/utils/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Pencil } from "lucide-react";
import EditBookDialog from "./EditBookDialog";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const statusColors = {
    reading: { bg: "bg-blue-100", text: "text-blue-700" },
    read: { bg: "bg-green-100", text: "text-green-700" },
    to_read: { bg: "bg-gray-100", text: "text-gray-700" },
  };

  const { bg, text } = statusColors[book.status];

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href={book.goodreadsUrl}
            target="_blank"
            className="text-lg font-space text-primary hover:underline transition-colors inline-block"
          >
            {book.title}
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-[32rem]">
          <div className="flex justify-between space-x-4">
            {book.coverUrl && (
              <div className="relative w-24 h-36 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Hide the image container if loading fails
                    (e.target as HTMLElement).parentElement?.remove();
                  }}
                />
              </div>
            )}
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-space font-bold">{book.title}</h3>
                {process.env.NODE_ENV === 'development' && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setEditOpen(true);
                    }}
                    className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Pencil className="size-4" />
                  </button>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Author: </span>
                  <span className="font-semibold">{book.author}</span>
                </p>
                <Badge variant="secondary" className={`${bg} ${text} hover:${bg}`}>
                  {book.status.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              </div>
              {book.learning && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Learning</p>
                  <p className="text-sm text-muted-foreground">
                    {book.learning}
                  </p>
                </div>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <EditBookDialog 
        book={book}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
} 