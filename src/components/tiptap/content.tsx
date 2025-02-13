"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Link from "./custom-link";
import { all, createLowlight } from "lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Node } from '@tiptap/pm/model';
import Heading from '@tiptap/extension-heading';

import "@/components/tiptap/styles.css";
import { forwardRef, useImperativeHandle, useEffect } from "react";

interface TiptapProps {
  content: string;
  editable?: boolean;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  onReady?: (editor: ReturnType<typeof useEditor>) => void;
}

export interface TiptapContentRef {
  getEditor: () => ReturnType<typeof useEditor> | null;
}

const lowlight = createLowlight(all);

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }: { 
    node: Node, 
    HTMLAttributes: Record<string, any> 
  }) {
    const level = node.attrs.level;
    const id = node.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return [`h${level}`, { ...HTMLAttributes, id, class: 'tiptap-heading' }, 0];
  },
});

const TiptapContent = forwardRef<TiptapContentRef, TiptapProps>(
  ({ content, editable = true, onChange, placeholder, className, onReady }, ref) => {
    const editor = useEditor({
      extensions: [
        Image,
        Typography,
        Link.configure({
          autolink: false,
        }),
        CodeBlockLowlight.configure({
          lowlight,
          HTMLAttributes: {
            class: "code-block",
          },
        }),
        Markdown.configure({
          tightLists: false,
        }),
        StarterKit.configure({
          heading: false,
          codeBlock: false,
        }),
        CustomHeading.configure({
          levels: [1, 2, 3],
        }),
        Placeholder.configure({
          placeholder: placeholder ?? 'Write something...',
        }),
      ],
      content: content,
      editable: editable,
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.storage.markdown.getMarkdown());
        }
      },
    });

    useEffect(() => {
      if (editor && onReady) {
        onReady(editor);
      }
    }, [editor, onReady]);

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    return (
      <div className={className}>
        <EditorContent editor={editor} />
      </div>
    );
  }
);

TiptapContent.displayName = "TiptapContent";

export default TiptapContent;
