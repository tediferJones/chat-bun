import { Database } from "bun:sqlite";
const db = new Database('users.sqlite', { create: true })
// db.query('create table users;').run()


export function GET(req: any) {
  console.log(req.body)
  return new Response('Hello from login api route')
}

export async function POST(req: Request, servers: any) {
  const { username, password } = await req.json()
  console.log(username, password)
  // SANITIZE YOUR INPUTS
  // How do we even go about doing this? This has direct access to the database, which is very risky
  // console.log(await req.json())
  const hash = await Bun.password.hash(password)
  console.log(hash)
  // servers['hello'] = 'i added this to the obj'
  console.log(servers)
  db.query(`INSERT INTO users (username, password) VALUES ($username, $password)`).run({
    $username: username,
    $password: password,
  })

  // const query = db.query('SELECT * FROM users')
  // const result = query.all()
  // console.log(result)
  console.log(db.query('SELECT * FROM users').all())

  return new Response('Hello from login api POST route')
}
