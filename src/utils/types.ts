export interface ProjectLinks {
  diy: string;
  progress: string;
  purchase?: string;
}

export type Project = {
  id: string;
  title: string;
  description: string | null;
  mediaKey: string | null;
  slug: string;
  purchaseLink: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectUpdate = {
  id: string;
  projectId: string;
  update: string;
  description: string;
  mediaKey: string | null;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}; 