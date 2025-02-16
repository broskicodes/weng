export interface ProjectLinks {
  diy: string;
  progress: string;
  purchase?: string;
}

export type ProjectStatus = 'active' | 'hiatus' | 'complete';
export type ProjectDifficulty = 'novice' | 'intermediate' | 'cracked';

export type Project = {
  id: string;
  title: string;
  description: string | null;
  mediaKey: string | null;
  slug: string;
  purchaseLink: string | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  details?: Omit<ProjectDetails, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;
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

export type ProjectDetails = {
  id: string;
  projectId: string;
  cost: string;
  buildTime: string;
  difficulty: ProjectDifficulty;
  writeUp: string;
  createdAt: Date;
  updatedAt: Date;
};