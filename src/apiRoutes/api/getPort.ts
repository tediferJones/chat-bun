import verifyUser from 'modules/verifyUser'
import { verifyInputs } from 'modules/inputValidation';
import { BackendServerObj, BackendServers, ResBody } from 'types';

export async function POST(req: Request, servers: BackendServers) {
  const { servername } = await req.json();
  const resBody: ResBody = {
    errors: {},
  }

  const userAuth = verifyUser(req);
  if (!userAuth) {
    resBody.errors.auth = 'You must login to access this route';
    return new Response(JSON.stringify(resBody));
  }

  const validation = verifyInputs({ servername });
  if (!validation.isValid) {
    resBody.errors = validation.errors;
    return new Response(JSON.stringify(resBody));
  }

  // If servername already exists, look up the port number
  if (servers[servername]) {
    resBody.port = servers[servername].port;
    return new Response(JSON.stringify(resBody));
  }

  // Ports should be in the range from 49152 to 65535
  resBody.port = 49152;
  // This isnt fast, but it keeps port numbers low and prevents copies
  const activePorts = Object.keys(servers).map((servername: string) => servers[servername].port);
  while (activePorts.includes(resBody.port)) resBody.port++

  if (resBody.port > 65535) {
    resBody.errors.servername = 'No ports available, try again later';
    return new Response(JSON.stringify(resBody));
  }

  const newServer = Bun.serve<{ username: string, color: string }>({
    port: resBody.port,
    development: false,
    fetch: (req, server) => {
      // Validate the user on initial request
      console.log('RECIEVED NEW WEBSOCKET REQUEST')
      const user = verifyUser(req);
      if (!user) return new Response(JSON.stringify('YOU ARE NOT LOGGED IN'))
      if (server.upgrade(req, { data: { 
        username: user.username, 
        color: user.color,
      } })) return
      return new Response("Upgrade failed :|", { status: 500 });
    },
    websocket: {
      message(ws, message) {
        console.log('sending message to clients')
        const newMessage = JSON.stringify({
          username: ws.data.username,
          color: ws.data.color,
          message: ': ' + message,
        });

        for (const key in servers[servername].clients) {
          servers[servername].clients[key].send(newMessage);
        }
      },
      open(ws) {
        console.log('send connecting message')
        servers[servername].clients[ws.data.username] = ws;
        const newMessage = JSON.stringify({
          username: ws.data.username,
          color: ws.data.color,
          message: ' has connected',
        });

        for (const key in servers[servername].clients) {
          servers[servername].clients[key].send(newMessage)
        }
      },
      close(ws) {
        delete servers[servername].clients[ws.data.username]

        if (!Object.keys(servers[servername].clients).length) {
          servers[servername].stop();
          delete servers[servername];
          return;
        }

        const newMessage = JSON.stringify({
          username: ws.data.username,
          color: ws.data.color,
          message: ' has disconnected',
        });
        for (const key in servers[servername].clients) {
          servers[servername].clients[key].send(newMessage)
        }
      }
    }
  }) as BackendServerObj
  newServer.clients = {};
  servers[servername] = newServer;
  console.log(servers)
  // console.log(process.env)

  return new Response(JSON.stringify(resBody));
}
