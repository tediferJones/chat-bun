import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  salt: text('salt').notNull(),
  color: text('color').notNull().default('#ffffff')
});

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey(),
  username: text('username').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: integer('expiresAt').notNull(),
});
