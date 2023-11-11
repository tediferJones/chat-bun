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
  if (!status || !username) {
    resData.errors.status = 'Not Authorized';
    return new Response(JSON.stringify(resData))
  }

  db.query('UPDATE users SET color = $color WHERE username = $username')
    .get({ $username: username, $color: color })

  // console.log('SET COLOR, SERVERS = ')
  // console.log(servers)
  // Iterate through all servers, where username matches, update color attr of ws.data
  Object.keys(servers).forEach((servername: string) => {
    for (let i = 0; i < servers[servername].clients.length; i++) {
      if (servers[servername].clients[i].data.username === username) {
        servers[servername].clients[i].data.color = color;
        break;
      }
    }
  })

  return new Response(JSON.stringify(resData));

}
