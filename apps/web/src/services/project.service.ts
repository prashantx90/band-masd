import directus from '../lib/directus';
import { readItems, readItem, createItem } from '@directus/sdk';
import { Project } from '../types';

export async function getProjects(): Promise<Project[]> {
  return directus.request(
    readItems('projects', {
      sort: ['-created_at'] as any,
    })
  );
}

export async function getProject(id: string): Promise<Project> {
  return directus.request(readItem('projects', id));
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  return directus.request(createItem('projects', data as any));
}
