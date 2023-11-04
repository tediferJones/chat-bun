import db from '../../database';
import verifyInputs from '../../modules/verifyInputs';
import { ResBody } from '../../types';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const resData: ResBody = {
    errors: [],
  }

  const validation = verifyInputs({ username, password })
  if (!validation.isValid) {
    resData.errors.push(...validation.errors)
    return new Response(JSON.stringify(resData))
  }


  // Validate that username does not already exist
  const existingUsername = db.query('SELECT * FROM users WHERE username = $username').get({ $username: username })
  if (existingUsername) {
    resData.errors.push('Username already exists')
    return new Response(JSON.stringify(resData))
  }

  const testToken = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64')
  console.log(testToken)
  db.query('INSERT INTO users (username, password) VALUES ($username, $password)')
    .run({
      $username: username,
      $password: await Bun.password.hash(password),
    })

  return new Response(JSON.stringify(resData))
}
