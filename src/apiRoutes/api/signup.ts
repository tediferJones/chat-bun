import db from '../../database';
import { verifyInputs } from '../../modules/inputValidation';
import { ResBody } from '../../types';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const resData: ResBody = {
    errors: {},
  }

  const validation = verifyInputs({ username, password })
  if (!validation.isValid) {
    // This is pretty sloppy, try to not make copies if possible
    resData.errors = {
      ...resData.errors,
      ...validation.errors,
    }
    return new Response(JSON.stringify(resData))
  }


  // Validate that username does not already exist
  const existingUsername = db.query('SELECT * FROM users WHERE username = $username').get({ $username: username })
  if (existingUsername) {
    resData.errors.username = 'Username already exists'
    return new Response(JSON.stringify(resData))
  }

  // WHY IS THIS HERE, DELETE IT
  // Or use it to generate salt for password hash
  const testToken = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64')
  console.log(testToken)
  db.query('INSERT INTO users (username, password) VALUES ($username, $password)')
    .run({
      $username: username,
      $password: await Bun.password.hash(password),
    })

  return new Response(JSON.stringify(resData))
}
