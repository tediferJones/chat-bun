import db from '../../database';

export function GET(req: any) {
  console.log(req.body)
  return new Response('Hello from login api route')
}

export async function POST(req: Request, servers: any) {
  const { username, password } = await req.json()
  console.log('REQ COOKIE: ', req.headers.get('cookie'))
  // console.log(username, password)
  // console.log(servers)

  const hashedPassword = db.query<{ password: string }, { $username: string }>(
    'SELECT password FROM users WHERE username = $username'
  ).get({ $username: username })
  // console.log(hashedPassword)

  // If db result contains no password, the username does not exist
  if (!hashedPassword?.password) {
    return new Response(JSON.stringify({
      errorMsg: 'Username not found'
    }))
  }

  // If the hashed password doesnt match db result, password is wrong
  if (!await Bun.password.verify(password, hashedPassword.password)) {
    return new Response(JSON.stringify({
      errorMsg: 'Password does not match'
    }))
  }
  
  // If the function makes it to this point, the user has been successfully authenticated
  // Create a session record for this user, send back a cookie with a hash to validate users in the future
  // console.log(Bun.hash('HELLO WORLD', 777))
  // console.log(crypto.randomUUID())

  // const sessionToken = crypto.randomUUID()
  let token;
  let tokenExists = true;
  // let test;
  
  while (tokenExists) {
    console.log('GENERATING NEW TOKEN')

    const testToken = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64')
    const result = db.query('SELECT * FROM sessions WHERE token = $token').get({ $token: testToken })

    if (!result) {
      token = testToken;
      tokenExists = false;
    }
  }
  console.log(token)
  // const expirationDate = new Date(Date.now() + 1000*60*60*24)
  // console.log(test)

  // console.log('DATABASE RESULT:', result)

  // console.log(db.query('SELECT * FROM users').all())

  return new Response(JSON.stringify({
    errorMsg: 'Login successful'
  }), {
      headers: {
        'Set-Cookie': `sessionToken=${token}; Max-Age=${60*60*24}; Path=/; HttpOnly; Secure;`
      }
    })
}
