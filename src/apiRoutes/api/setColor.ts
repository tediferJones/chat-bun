import db from 'database';
import { verifyInputs } from 'modules/inputValidation';
import verifyUser from 'modules/verifyUser';
import { BackendServers, ResBody } from 'types';

////: 

export async function POST(req: Request, servers: BackendServers) {
  const { color } = await req.json();
  const resData: ResBody = {
    errors: {}
  }

  // const { status, username } = verifyUser(req);
  const user = verifyUser(req);
  // if (!status || !username) {
  if (!user) {
    resData.errors.status = 'Not Authorized';
    return new Response(JSON.stringify(resData))
  }

  const validation = verifyInputs({ color });
  if (!validation.isValid) {
    resData.errors = validation.errors;
    return new Response(JSON.stringify(resData));
  }

  db.query('UPDATE users SET color = $color WHERE username = $username')
    // .get({ $username: username, $color: color })
    .get({ $username: user.username, $color: color })

  // Iterate through all servers, where username matches, update color attr of ws.data
  Object.keys(servers).forEach((servername: string) => {
    for (let i = 0; i < servers[servername].clients.length; i++) {
      // if (servers[servername].clients[i].data.username === username) {
      if (servers[servername].clients[i].data.username === user.username) {
        servers[servername].clients[i].data.color = color;
        break;
      }
    }
  })

  return new Response(JSON.stringify(resData));
}
