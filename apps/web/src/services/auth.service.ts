import directus from '../lib/directus';
import { readMe } from '@directus/sdk';

export async function loginWithDirectus(email: string, password: string) {
  return await directus.login({ email, password });
}

export async function logoutFromDirectus() {
  return await directus.logout();
}

export async function getCurrentUser() {
  return await directus.request(readMe({
    fields: ['id', 'first_name', 'last_name', 'email', 'avatar']
  }));
}
