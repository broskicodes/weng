import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const projectStatus = pgEnum('project_status', ['active', 'hiatus', 'complete']);
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  mediaKey: text('media_key'),
  slug: text('slug').notNull().unique(),
  purchaseLink: text('purchase_link'),
  status: projectStatus('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 

export const projectProgress = pgTable('project_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  update: text('update').notNull(),
  description: text('description').notNull(),
  mediaKey: text('media_key'),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectDifficulty = pgEnum('project_difficulty', ['novice', 'intermediate', 'cracked']);
export const projectDetails = pgTable('project_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  cost: text('cost').notNull(),
  difficulty: projectDifficulty('difficulty').notNull(),
  writeUp: text('write_up').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});