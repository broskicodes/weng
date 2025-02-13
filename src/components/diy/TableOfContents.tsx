'use client';

import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  editor: Editor | null;
}

interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

export default function TableOfContents({ editor }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    if (!editor) return;

    const items: HeadingItem[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const id = node.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        items.push({
          level: node.attrs.level,
          text: node.textContent,
          id
        });
      }
    });
    setHeadings(items);
  }, [editor]);

  if (!headings.length) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Get header height - assuming header has a fixed class we can find
      const header = document.querySelector('header');
      const offset = header ? header.getBoundingClientRect().height : 10;

      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });

      // Debug info
      console.log({
        id,
        element,
        elementPosition,
        offset,
        finalPosition: elementPosition - offset
      });
    } else {
      console.warn(`Heading with id "${id}" not found`);
    }
  };

  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Table of Contents</h3>
      <nav className="space-y-3">
        {headings.map((heading, index) => (
          <button
            key={index}
            onClick={() => scrollToHeading(heading.id)}
            className={cn(
              "block w-full text-left transition-colors hover:text-primary",
              heading.level === 1 && "font-medium text-gray-900",
              heading.level === 2 && "pl-4 text-gray-700",
              heading.level === 3 && "pl-8 text-sm text-gray-600"
            )}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
} 