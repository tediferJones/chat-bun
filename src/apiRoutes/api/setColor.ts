import db from 'database';
import { verifyInputs } from 'modules/inputValidation';
import verifyUser from 'modules/verifyUser';
import { BackendServers, ResBody } from 'types';

export async function POST(req: Request, servers: BackendServers) {
  const { color } = await req.json();
  const resBody: ResBody = {
    errors: {}
  }

  const user = verifyUser(req);
  if (!user) {
    resBody.errors.status = 'Not Authorized';
    return new Response(JSON.stringify(resBody))
  }

  const validation = verifyInputs({ color });
  if (!validation.isValid) {
    resBody.errors = validation.errors;
    return new Response(JSON.stringify(resBody));
  }

  db.query('UPDATE users SET color = $color WHERE username = $username')
    .get({ $username: user.username, $color: color })

  // Update username color for active connections
  for (const servername in servers) {
    if (servers[servername].clients[user.username]) {
      servers[servername].clients[user.username].data.color = color
    }
  }

  return new Response(JSON.stringify(resBody));
}
