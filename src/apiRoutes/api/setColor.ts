import db from 'database';
import verifyUser from 'modules/verifyUser';
import { BackendServers, ResBody } from 'types';

export async function POST(req: Request, servers: BackendServers) {
  // THIS NEEDS INPUT VALIDATION
  const { color } = await req.json();
  const resData: ResBody = {
    errors: {}
  }

  const { status, username } = verifyUser(req);
  if (!status) {
    resData.errors.status = 'Not Authorized';
    return new Response(JSON.stringify(resData))
  }

  db.query('UPDATE users SET color = $color WHERE username = $username')
    .get({ $username: username, $color: color })

  return new Response(JSON.stringify(resData));

}
