'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ProjectDetails } from '@/utils/types';
import DevDetailsForm from '@/components/diy/DevDetailsForm';
import Content from '@/components/tiptap/content';
import TableOfContents from './TableOfContents';
import { Editor as TiptapEditor } from '@tiptap/react';

interface EditorProps {
  slug: string;
  details: Omit<ProjectDetails, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;
  preview?: boolean;
  projectDetails?: React.ReactNode;
}

export default function Editor({ slug, details, preview = false, projectDetails }: EditorProps) {
  const [isPreview, setIsPreview] = useState(preview);
  const [editor, setEditor] = useState<TiptapEditor | null>(null);

  const contentView = (
    <div className="space-y-6">
      {details.youtubeUrl && (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${details.youtubeUrl.split('v=')[1]}`}
            className="size-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
        <div className="lg:hidden">
          {projectDetails}
          <div className="mt-6">
            <TableOfContents editor={editor} />
          </div>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 prose max-w-none">
          <Content 
            content={details.writeUp}
            editable={false}
            className="min-h-96"
            onReady={setEditor}
          />
        </div>
        <div className="hidden lg:block">
          {projectDetails}
          <div className="sticky top-6 mt-6">
            <TableOfContents editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );

  if (preview) return contentView;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Switch
          id="preview-mode"
          checked={isPreview}
          onCheckedChange={setIsPreview}
        />
        <Label htmlFor="preview-mode">Preview Mode</Label>
      </div>

      {isPreview ? contentView : (
        <div>
          <h2 className="mb-4 text-xl font-bold">Edit DIY Guide</h2>
          <DevDetailsForm slug={slug} existingDetails={details} />
        </div>
      )}
    </div>
  );
} 