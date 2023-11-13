import getCookies from 'modules/getCookies';
import db from 'database';
import { ResBody } from 'types';

export function GET(req: Request) {
  const { sessionToken } = getCookies(req);
  const resData: ResBody = {
    errors: {},
  }

  // Delete associated session token from DB, and set cookie expiration to some date in the past
  if (sessionToken) {
    db.query('DELETE FROM sessions WHERE token = $token').run({ $token: sessionToken });
  } else {
    resData.errors.token = 'Token not found'
  }

  return new Response(JSON.stringify(resData), {
    headers: {
      'Set-Cookie': `sessionToken=''; Max-Age=0; Path=/;`,
    },
  })
}
