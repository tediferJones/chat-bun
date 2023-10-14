import { Database } from "bun:sqlite";

const db = new Database('database.sqlite', { create: true })

db.query(`CREATE TABLE IF NOT EXISTS users (
  username TEXT UNIQUE,
  password TEXT
)`).run()

db.query(`CREATE TABLE IF NOT EXISTS sessions (
  username TEXT UNIQUE,
  token TEXT UNIQUE,
  expiresAt INTEGER
)`).run()

export default db
