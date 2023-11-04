import db from '../database';
import getCookies from './getCookies';
import { UserAuth } from '../types';

export default function verifyUser(req: Request): UserAuth {
  const result: UserAuth = {
    status: false,
    username: '',
  }

  const { sessionToken } = getCookies(req)

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

  return result
}
