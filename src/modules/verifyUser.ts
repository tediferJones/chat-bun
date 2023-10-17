import db from '../database';
import getCookies from './getCookies';

export default function verifyUser(req: Request) {
  const result = {
    status: false,
    username: '',
  }

  const { sessionToken } = getCookies(req)
  // const token = sessionToken

  if (sessionToken) {
    const dbResult = db.query<{
      expiresAt: number, 
      username: string,
      token: string,
    }, { 
        $token: string, 
    }>('SELECT * FROM sessions WHERE token = $token').get({ $token: sessionToken })

    if (dbResult?.expiresAt && dbResult?.username && dbResult.expiresAt > Date.now()) {
      result.status = true
      result.username = dbResult.username
    }
  }

  // console.log(db.query('SELECT * FROM sessions').all())

  return result
}
