import { migrate } from 'drizzle-orm/libsql/migrator';
import { db, client } from './db';

console.log('ATTEMPTING MIGRATION')
await migrate(db, { migrationsFolder: './db/migrations' });
console.log('FINISHED MIGRATION')

client.close();
