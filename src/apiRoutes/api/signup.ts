import db from '../../database';
import verifyInputs from '../../modules/verifyInputs';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const resData: { status: boolean, errors: string[] } = {
    status: false,
    errors: []
  }

  const validation = verifyInputs({ username, password })
  if (!validation.isValid) {
    resData.errors = validation.errors
    return new Response(JSON.stringify(resData))
  }


  // Validate that username does not already exist
  const existingUsername = db.query('SELECT * FROM users WHERE username = $username').get({ $username: username })
  if (existingUsername) {
    resData.errors = ['Username already exists']
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
