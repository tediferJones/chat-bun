import { verifyInputs } from 'modules/inputValidation';
import db from 'database';
import { ResBody } from 'types';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const resData: ResBody = {
    errors: {},
  }

  const validation = verifyInputs({ username, password })
  if (!validation.isValid) {
    resData.errors = validation.errors;
    return new Response(JSON.stringify(resData))
  }


  // Validate that username does not already exist
  const existingUsername = db.query('SELECT * FROM users WHERE username = $username').get({ $username: username })
  if (existingUsername) {
    resData.errors.username = 'Username already exists'
    return new Response(JSON.stringify(resData))
  }

  const salt = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64')
  db.query('INSERT INTO users (username, password, salt) VALUES ($username, $password, $salt)')
    .run({
      $username: username,
      $password: await Bun.password.hash(password + salt),
      $salt: salt,
    })

  return new Response(JSON.stringify(resData))
}
