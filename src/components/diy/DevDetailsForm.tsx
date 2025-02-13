'use client';

import { useState } from 'react';
import { ProjectDifficulty, ProjectDetails } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Content from '@/components/tiptap/content';

interface DevDetailsFormProps {
  slug: string;
  existingDetails?: Omit<ProjectDetails, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;
}

export default function DevDetailsForm({ slug, existingDetails }: DevDetailsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [writeUp, setWriteUp] = useState(existingDetails?.writeUp ?? '');
  const [cost, setCost] = useState(existingDetails?.cost ?? '');
  const [difficulty, setDifficulty] = useState<ProjectDifficulty>(existingDetails?.difficulty ?? 'intermediate');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${slug}/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writeUp, cost, difficulty }),
      });
      if (!res.ok) throw new Error('Failed to save details');
      toast.success('Details saved successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to save details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <Content 
          content={writeUp} 
          onChange={(content) => setWriteUp(content)}
          className="min-h-96"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Cost</label>
        <input
          type="text"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="~$50"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as ProjectDifficulty)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="novice">Novice</option>
          <option value="intermediate">Intermediate</option>
          <option value="cracked">Cracked</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
} 