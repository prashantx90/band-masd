import directus from '../lib/directus';
import { readItems, readItem } from '@directus/sdk';
import { Agent } from '../types';

export async function getAgents(): Promise<Agent[]> {
  return directus.request(
    readItems('agents', {
      sort: ['sort_order'] as any,
    })
  );
}

export async function getAgent(id: string): Promise<Agent> {
  return directus.request(readItem('agents', id));
}
