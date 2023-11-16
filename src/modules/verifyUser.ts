import getCookies from 'modules/getCookies';
import db from 'database';
import { UserAuth } from 'types';

export default function verifyUser(req: Request): UserAuth {
  let result;

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
      result = {
        username: dbResult.username,
        color: db.query<{ color: string }, { $username: string }>('SELECT color FROM users WHERE username = $username')
        .get({ $username: dbResult.username })?.color || '#ffffff',
      }
    }
  }

  return result
}
