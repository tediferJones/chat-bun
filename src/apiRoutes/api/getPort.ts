import verifyUser from 'modules/verifyUser'
import { BackendServers, ResBody } from 'types';

export async function POST(req: Request, servers: BackendServers) {
  const { servername } = await req.json();
  const userAuth = verifyUser(req);
  const resData: ResBody = {
    port: 0,
    errors: {},
  }

  // We should probably verify user inputs somewhere around here

  if (!userAuth.status) {
    resData.errors.auth = 'You must login to access this route';
    return new Response(JSON.stringify(resData));
  }

  // If servername already exists, look up the port number
  if (servers[servername]) {
    console.log('SERVER ALREADY EXISTS, RETURNING')
    resData.port = servers[servername].server.port;
    return new Response(JSON.stringify(resData));
  }

  console.log('CREATING A NEW WEBSOCKET SERVER')
  console.log(servername)
  console.log(servers)

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
        console.log('NEW WEBSOCKET REQUEST RECIEVED')
        const { status, username, color } = verifyUser(req)
        if (!status) return new Response(JSON.stringify('YOU ARE NOT LOGGED IN'))
        if (server.upgrade(req, { data: { username, color } })) return
        return new Response("Upgrade failed :|", { status: 500 });
      },
      websocket: {
        message(ws, message) {
          console.log('WEBSOCKET HAS RECIEVED A MESSAGE FROM ' + ws.data.username)
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
          console.log('WEBSOCKET HAS BEEN OPENED FOR ' + ws.data.username)
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
          console.log('CLOSING WEBSOCKET FOR ' + ws.data.username)
          servers[servername].clients.splice(servers[servername].clients.indexOf(ws), 1)
          if (servers[servername].clients.length) {
            const newMessage = JSON.stringify({
              username: ws.data.username,
              color: ws.data.color,
              message: ' has disconnected',
            });
            servers[servername].clients.forEach((client) => {
              client.send(newMessage)
            })
          } else {
            // If there are no clients, remove the server from servers obj
            servers[servername].server.stop()
            delete servers[servername];
          }
        }
      }
    }),
  }

  console.log('Active Servers: ', servers)
  return new Response(JSON.stringify(resData));
}
