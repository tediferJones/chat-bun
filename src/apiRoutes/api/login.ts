import db from '../../database';
import { verifyInputs } from '../../modules/inputValidation';
import { ResBody } from '../../types';

export async function POST(req: Request) {
  const { username, password }: { username: string, password: string } = await req.json()
  const resData: ResBody = {
    errors: {},
  }
  const validation = verifyInputs({ username, password })
  if (!validation.isValid) {
    resData.errors = validation.errors
    return new Response(JSON.stringify(resData))
  }

  // const hashedPassword = db.query<{ password: string }, { $username: string }>(
  //   'SELECT password FROM users WHERE username = $username'
  const hashedPassword = db.query<{ password: string, salt: string }, { $username: string }>(
    'SELECT password,salt FROM users WHERE username = $username'
  ).get({ $username: username })

  // If db result contains no password, the username does not exist
  if (!hashedPassword?.password) {
    resData.errors.username = 'Username not found'
    return new Response(JSON.stringify(resData))
  }

  // If the hashed password doesnt match db result, password is wrong
  if (!await Bun.password.verify(password + hashedPassword.salt, hashedPassword.password)) {
    resData.errors.password = 'Password is incorrect'
    return new Response(JSON.stringify(resData))
  }
  
  // If the function makes it to this point, the user has been successfully authenticated
  // Create a session record for this user, send back a cookie with a hash to validate users in the future
  let token;
  let tokenExists = true;
  
  while (tokenExists) {
    const testToken = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64')
    const result = db.query('SELECT * FROM sessions WHERE token = $token').get({ $token: testToken })

    if (!result) {
      token = testToken;
      tokenExists = false;
    }
  }
  const expiresAt = new Date(Date.now() + 1000*60*60*24)

  if (token) {
    db.query('INSERT INTO sessions (username, token, expiresAt) VALUES ($username, $token, $expiresAt)')
      .run({
        $username: username,
        $token: token,
        $expiresAt: expiresAt.getTime(),
      })
  }

  return new Response(JSON.stringify(resData), {
      headers: {
        'Set-Cookie': `sessionToken=${token}; Expires=${expiresAt}; Path=/; SameSite=Strict; HttpOnly; Secure;`,
      }
    })
}
