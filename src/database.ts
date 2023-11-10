import { Database } from "bun:sqlite";

const db = new Database('database.sqlite', { create: true })

db.query(`CREATE TABLE IF NOT EXISTS users (
  username TEXT UNIQUE,
  password TEXT,
  salt TEXT,
  color TEXT DEFAULT "#ffffff"
)`).run()

db.query(`CREATE TABLE IF NOT EXISTS sessions (
  username TEXT,
  token TEXT UNIQUE,
  expiresAt INTEGER
)`).run()

export default db
