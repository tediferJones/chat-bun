import 'dotenv/config';
import type { Config } from 'drizzle-kit';
 
if (!process.env.TURSO_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.log('BORKED')
  throw Error('Cant find env variables')
}

export default {
	schema: './db/schema.ts',
	out: './db/migrations',
	driver: 'turso', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }
	// driver: 'mysql2', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	// dbCredentials: {
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
	// },
} satisfies Config;
