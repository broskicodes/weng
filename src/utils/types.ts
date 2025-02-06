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
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectUpdate = {
  id: string;
  projectId: string;
  update: string;
  description: string;
  media: string | null;
  createdAt: Date;
  updatedAt: Date;
}; 