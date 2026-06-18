import directus from '../lib/directus';
import { readItems, createItem } from '@directus/sdk';
import { Message } from '../types';

export async function getMessages(workflowId?: string): Promise<Message[]> {
  const options: any = {
    sort: ['-created_at'],
    limit: 100,
  };

  if (workflowId) {
    options.filter = {
      workflow_id: { _eq: workflowId },
    };
  }

  return directus.request(readItems('messages', options));
}

export async function createMessage(data: Partial<Message>): Promise<Message> {
  return directus.request(createItem('messages', data as any));
}
