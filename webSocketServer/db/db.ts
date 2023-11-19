import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

if (!process.env.TURSO_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.log('BORKED')
  throw Error('Cant find env variables')
}

export const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
