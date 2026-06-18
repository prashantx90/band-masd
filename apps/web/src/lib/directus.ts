import { createDirectus, rest, authentication } from '@directus/sdk';
import { DirectusSchema } from './directus-schema';

const directusUrl = 
  (import.meta.env.NEXT_PUBLIC_DIRECTUS_URL as string) || 
  (import.meta.env.VITE_DIRECTUS_URL as string) || 
  'https://admin.trademachine.work.gd';

const directus = createDirectus<DirectusSchema>(directusUrl)
  .with(rest())
  .with(authentication('json'));

export default directus;
export * from '@directus/sdk';
