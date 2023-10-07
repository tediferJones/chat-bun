import { Database } from "bun:sqlite";
const db = new Database('users.sqlite', { create: true })

export function GET(req: any) {
  console.log(req.body)
  return new Response('Hello from login api route')
}

export async function POST(req: Request, servers: any) {
  const { username, password } = await req.json()
  console.log(username, password)
  // console.log(await req.json())
  const hash = await Bun.password.hash(password)
  console.log(hash)
  // servers['hello'] = 'i added this to the obj'
  console.log(servers)

  // const addUserFunc = db.prepare('INSERT INTO users (username, password) VALUES ($username, $password)')
  // const addUserTrans = db.transaction((username, password) => {
  //   addUserFunc.run(username, password)
  // })
  // const count = addUserTrans([
  //   {
  //     $username: username,
  //     $password: password,
  //   }
  // ])
  // console.log(`${count} USERS ADDED`)
  return new Response('Hello from login api POST route')
}
