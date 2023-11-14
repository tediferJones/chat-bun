import getCookies from 'modules/getCookies';
import db from 'database';
import { UserAuth } from 'types';
////: Delete all this stuff
// type UserAuth = undefined | {
//   username: string,
//   color: string,
// }

export default function verifyUser(req: Request): UserAuth {
  // const result: UserAuth = {
  //   status: false,
  // }
  // let result = null;
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
      // result.status = true
      // result.username = dbResult.username
      // result.color = db.query<{ color: string }, { $username: string }>('SELECT color FROM users WHERE username = $username')
      //  .get({ $username: dbResult.username })?.color;
      result = {
        username: dbResult.username,
        color: db.query<{ color: string }, { $username: string }>('SELECT color FROM users WHERE username = $username')
        .get({ $username: dbResult.username })?.color || '#ffffff',
      }
    }
  }

  return result
}
