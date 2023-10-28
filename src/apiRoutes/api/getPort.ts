import verifyUser from '../../modules/verifyUser'
import { ServerWebSocket } from 'bun';

export async function POST(req: Request, servers: any) {
  const { servername } = await req.json();
  const userAuth = verifyUser(req);
  const resData: { port: number, errors: string[] } = {
    port: 0,
    errors: [],
  }

  if (!userAuth.status) {
    resData.errors.push('You must login to access this route');
    return new Response(JSON.stringify(resData));
  }

  if (servers[servername]) {
    console.log('SERVER ALREADY EXISTS, RETURNING')
    resData.port = servers[servername].server.port;
    return new Response(JSON.stringify(resData));
  }

  console.log('CREATING A NEW WEBSOCKET SERVER')
  // If server doesn't already exist, find a new port number and create a new websocket server
  // Ports should be in the range from 49152 to 65535
  // let port = 49152;
  resData.port = 49152;
  // This isnt fast, but it keeps port numbers low and prevents copies
  const activePorts = Object.keys(servers).map((servername: string) => servers[servername].server.port);
  // while (activePorts.includes(port)) port++
  while (activePorts.includes(resData.port)) resData.port++

  if (resData.port > 65535) {
    resData.errors.push('All servers are active, no empty ports left');
    return new Response(JSON.stringify(resData));
  }

  // resData.port = port;

  // servers[servername] = {};
  // servers[servername].clients = [];
  // servers[servername].server = Bun.serve<{ username: string }>({
  servers[servername] = {
    clients: [],
    server: Bun.serve<{ username: string }>({
      port: resData.port,
      // fetch: (req, server) => server.upgrade(req) ? undefined : 
      //   new Response("Upgrade failed :|", { status: 500 }),
      fetch: (req, server) => {
        // Validate the user on req, return "not logged in error" if they are not authorized
        console.log('NEW WEBSOCKET REQUEST RECIEVED')
        // const auth = verifyUser(req)
        const { status, username } = verifyUser(req)
        if (!status) return new Response(JSON.stringify('YOU ARE NOT LOGGED IN'))
        if (server.upgrade(req, { data: { username } })) return
        return new Response("Upgrade failed :|", { status: 500 });

        // if (server.upgrade(req, {
        //   data: {
        //     username: auth.username
        //   }
        // })) return;
        // return new Response("Upgrade failed :|", { status: 500 });
      },
      websocket: {
        message(ws, message) {
          console.log('WEBSOCKET HAS RECIEVED A MESSAGE FROM ' + ws.data.username)
          servers[servername].clients.forEach((client: any) => {
            client.send(`${ws.data.username}: ${message}`)
          })
        },
        open(ws) {
          console.log('WEBSOCKET HAS BEEN OPENED FOR ' + ws.data.username)
          servers[servername].clients.push(ws)
          servers[servername].clients.forEach((client: any) => {
            client.send(`${ws.data.username} has connected`)
          })
        },
        close(ws) {
          console.log('CLOSING WEBSOCKET FOR ' + ws.data.username)
          servers[servername].clients.splice(servers[servername].clients.indexOf(ws), 1)
          servers[servername].clients.forEach((client: any) => {
            client.send(`${ws.data.username} has disconnected`)
          })
          // IF THERE ARE NO CLIENTS LEFT AFTER SPLICING, REMOVE SERVER FROM SERVERS OBJ
        }
      }
    }),
  }

  console.log('Active Servers: ', servers)
  return new Response(JSON.stringify(resData));
}
