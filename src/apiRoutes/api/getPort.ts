import verifyUser from '../../modules/verifyUser'

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
    // resData.port = servers[servername].port;
    resData.port = servers[servername].server.port;
    return new Response(JSON.stringify(resData));
  }

  console.log('CREATING A NEW WEBSOCKET SERVER')
  // If server doesn't already exist, find a new port number and create a new websocket server
  // Ports should be in the range from 49152 to 65535
  let port = 49152;
  const activePorts = Object.keys(servers).map((servername: string) => servers[servername].port);
  while (activePorts.includes(port)) port++

  if (port > 65535) {
    resData.errors.push('All servers are active, no empty ports left');
    return new Response(JSON.stringify(resData));
  }

  resData.port = port;

  servers[servername] = {};
  servers[servername].clients = [];
  // servers[servername] = Bun.serve({
  servers[servername].server = Bun.serve({
    port,
    // fetch: (req, server) => {
    //   if (server.upgrade(req)) return;
    //   return new Response("Upgrade failed :(", { status: 500 });
    // },
    // fetch: () => new Response('lol idk'),
    fetch: (req, server) => server.upgrade(req) ? undefined : 
      new Response("Upgrade failed :(", { status: 500 }),
    // fetch: (req, server) => {
    //   return server.upgrade(req) ? undefined : 
    //     new Response("Upgrade failed :(", { status: 500 });
    // },
    websocket: {
      message(ws, message) {
        console.log('WEBSOCKET HAS RECIEVED A MESSAGE')
        // console.log(ws)
        // console.log(servers[servername])
        // console.log(message)
        // ws.send(message)

        servers[servername].clients.forEach((ws: any) => ws.send(message))

        // console.log('LIST OF ALL CLIENTS')
        // console.log(servers[servername].clients)
      },
      open(ws) {
        console.log('WEBSOCKET HAS BEEN OPENED')
        ws.send('you are connected')
        servers[servername].clients.push(ws)
        // TRY TO VERIFY IF THE USER IS AUTHORIZED OR NOT
      }
    }
  })

  console.log('Active Servers: ', servers)
  return new Response(JSON.stringify(resData));
}
