import { Database } from "bun:sqlite";
const db = new Database('users.sqlite', { create: true })
// db.query('create table users;').run()


export function GET(req: any) {
  console.log(req.body)
  return new Response('Hello from login api route')
}

export async function POST(req: Request, servers: any) {
  const { username, password } = await req.json()
  // console.log(username, password)
  // console.log(servers)

  const hashedPassword = db.query<{ password: string }, { $username: string }>(
    'SELECT password FROM users WHERE username = $username'
  ).get({ $username: username })
  console.log(hashedPassword)

  if (hashedPassword?.password && await Bun.password.verify(password, hashedPassword.password)) {
    console.log('PASSWORDS MATCH, USER SUCCESSFULLY AUTHENTICATED')
    // Create a session record for this user, send back a cookie with a hash to validate users in the future

  } else {
    console.log('PASSWORDS DO NOT MATCH, DENY AUTHENTICATION')
  }
  // console.log('DATABASE RESULT:', result)

  // console.log(db.query('SELECT * FROM users').all())

  return new Response('Hello from login api POST route')
}
