// console.log("Hello via Bun! TEST");

// const webSocketServer = Bun.serve<{ username: string, color: string }>({
const webSocketServer = Bun.serve({
  // port: resBody.port,
  port: process.env.PORT || 8000,
  development: false,
  fetch: (req, server) => {
    // Validate the user on initial request
    console.log('RECIEVED NEW WEBSOCKET REQUEST')
    // const user = verifyUser(req);
    // if (!user) return new Response(JSON.stringify('YOU ARE NOT LOGGED IN'))
    // if (server.upgrade(req, { data: { 
    //   username: user.username, 
    //   color: user.color,
    // } })) return
    // return new Response("Upgrade failed :|", { status: 500 });
    if (!server.upgrade(req)) {
      console.log('FAILED TO UPGRADE REQ')
      return new Response(JSON.stringify("failed to upgrade req"))
    }
  },
  websocket: {
    message(ws, message) {
      console.log('sending message to clients')
      // const newMessage = JSON.stringify({
      //   username: ws.data.username,
      //   color: ws.data.color,
      //   message: ': ' + message,
      // });

      // for (const key in servers[servername].clients) {
      //   servers[servername].clients[key].send(newMessage);
      // }
      ws.send(message)
    },
    open(ws) {
      console.log('OPENING WEBSOCKET CONNECTION')
      // servers[servername].clients[ws.data.username] = ws;
      // const newMessage = JSON.stringify({
      //   username: ws.data.username,
      //   color: ws.data.color,
      //   message: ' has connected',
      // });

      // for (const key in servers[servername].clients) {
      //   servers[servername].clients[key].send(newMessage)
      // }
    },
    close(ws) {
      console.log('CLOSING WEBSOCKET CONNECTION')
      // delete servers[servername].clients[ws.data.username]

      // if (!Object.keys(servers[servername].clients).length) {
      //   servers[servername].stop();
      //   delete servers[servername];
      //   return;
      // }

      // const newMessage = JSON.stringify({
      //   username: ws.data.username,
      //   color: ws.data.color,
      //   message: ' has disconnected',
      // });
      // for (const key in servers[servername].clients) {
      //   servers[servername].clients[key].send(newMessage)
      // }
    }
  }
})

console.log(`Web Socket Server is running on port ${webSocketServer.port}`)
