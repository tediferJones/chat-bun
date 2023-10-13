import { Database } from "bun:sqlite";

const db = new Database('users.sqlite', { create: true })

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // MAKE SURE USERNAME FIELD IS UNIQUE IN SQL SCHEMA
  // and then see what happens if we try to send it a duplicate username

  db.query('INSERT INTO users (username, password) VALUES ($username, $password)')
    .run({
      $username: username,
      $password: await Bun.password.hash(password),
    })

  console.log(db.query('SELECT * FROM users').all())

  return new Response('created new user')
}
