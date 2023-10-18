import db from '../../database';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const resData = {
    status: false,
    errorMsg: '',
  }

  // Validate that username does not already exist
  const existingUsername = db.query('SELECT * FROM users WHERE username = $username').get({ $username: username })
  if (existingUsername) {
    resData.errorMsg = 'Username already exists'
    return new Response(JSON.stringify(resData))
  }

  db.query('INSERT INTO users (username, password) VALUES ($username, $password)')
    .run({
      $username: username,
      $password: await Bun.password.hash(password),
    })

  // console.log(db.query('SELECT * FROM users').all())

  resData.status = true;
  return new Response(JSON.stringify(resData))
}
