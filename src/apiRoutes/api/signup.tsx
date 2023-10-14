import db from '../../database';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // MAKE SURE USERNAME FIELD IS UNIQUE IN SQL SCHEMA
  // and then see what happens if we try to send it a duplicate username
  //
  // YOU MUST CHECK TO MAKE SURE THE USERNAME IS UNIQUE
  const existingUsername = db.query('SELECT * FROM users WHERE username = $username').get({ $username: username })
  console.log(existingUsername)
  if (existingUsername) {
    console.log('EXISTING USERNAME FOUND')
    return new Response(JSON.stringify({
      errorMsg: 'Username already exists',
    }))
  }

  db.query('INSERT INTO users (username, password) VALUES ($username, $password)')
    .run({
      $username: username,
      $password: await Bun.password.hash(password),
    })

  console.log(db.query('SELECT * FROM users').all())

  return new Response(JSON.stringify('created new user'))
}
