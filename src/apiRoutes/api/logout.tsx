import db from '../../database';
import getCookies from '../../modules/getCookies';

export function GET(req: Request) {
  const { sessionToken } = getCookies(req);

  // Delete associated session token from DB, and set cookie expiration to some date in the past
  if (sessionToken) {
    db.query('DELETE FROM sessions WHERE token = $token').run({ $token: sessionToken })
  }

  return new Response(JSON.stringify('Logout completed successfully'), {
    headers: {
      'Set-Cookie': `sessionToken=''; Max-Age=0; Path=/;`,
    },
  })
}
