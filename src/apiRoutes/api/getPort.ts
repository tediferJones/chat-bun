import verifyUser from 'modules/verifyUser'
import { verifyInputs } from 'modules/inputValidation';
import { BackendServers, ResBody } from 'types';

export async function POST(req: Request, servers: BackendServers) {
  const { servername } = await req.json();
  const resData: ResBody = {
    errors: {},
  }

  const userAuth = verifyUser(req);
  // if (!userAuth.status) {
  if (!userAuth) {
    resData.errors.auth = 'You must login to access this route';
    return new Response(JSON.stringify(resData));
  }

  const validation = verifyInputs({ servername });
  if (!validation.isValid) {
    resData.errors = validation.errors;
    return new Response(JSON.stringify(resData));
  }

  // If servername already exists, look up the port number
  if (servers[servername]) {
    resData.port = servers[servername].server.port;
    return new Response(JSON.stringify(resData));
  }

  // Ports should be in the range from 49152 to 65535
  resData.port = 49152;
  // This isnt fast, but it keeps port numbers low and prevents copies
  const activePorts = Object.keys(servers).map((servername: string) => servers[servername].server.port);
  while (activePorts.includes(resData.port)) resData.port++

  if (resData.port > 65535) {
    resData.errors.servername = 'No ports available, try again later';
    return new Response(JSON.stringify(resData));
  }

  servers[servername] = {
    clients: [],
    server: Bun.serve<{ username: string, color: string }>({
      port: resData.port,
      fetch: (req, server) => {
        // Validate the user on req, return "not logged in error" if they are not authorized
        ////: const { status, username, color } = verifyUser(req)
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
          const newMessage = JSON.stringify({
            username: ws.data.username,
            color: ws.data.color,
            message: ': ' + message,
          });
          servers[servername].clients.forEach((client) => {
            client.send(newMessage)
          })
        },
        open(ws) {
          const newMessage = JSON.stringify({
            username: ws.data.username,
            color: ws.data.color,
            message: ' has connected',
          });
          servers[servername].clients.push(ws)
          servers[servername].clients.forEach((client) => {
            client.send(newMessage)
          })
        },
        close(ws) {
          servers[servername].clients.splice(servers[servername].clients.indexOf(ws), 1)
          if (!servers[servername].clients.length) {
            // If there are no clients, remove the server from servers obj
            servers[servername].server.stop();
            delete servers[servername];
            return;
          }

          const newMessage = JSON.stringify({
            username: ws.data.username,
            color: ws.data.color,
            message: ' has disconnected',
          });
          servers[servername].clients.forEach((client) => {
            client.send(newMessage)
          })
        }
      }
    }),
  }

  return new Response(JSON.stringify(resData));
}
