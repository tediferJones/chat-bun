// import { drizzle } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
// import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './db/schema';
import { db } from './db/db';
// console.log("Hello via Bun! TEST");
//
// WHAT THE FUCKING FUCK IT ACTUALLY WORKS
// Now we all have to do is redesign pretty much fucking everything aside from the style of the UI
// If we can get a planetscale database connected to this project we should be good to go
// console.log(process.env)

// JUST USE CHAT-LAYERS

// function database() {
//   if (process.env.TURSO_URL && process.env.TURSO_AUTH_TOKEN)
// }

// let db;
// if (!process.env.TURSO_URL || !process.env.TURSO_AUTH_TOKEN) {
//   console.log('BORKED')
//   throw Error('Cant find env variables')
// }
// const client = createClient({
//   url: process.env.TURSO_URL,
//   authToken: process.env.TURSO_AUTH_TOKEN,
// })
// const db = drizzle(client);
// This works but only because we manually created the table in the sqlite shell, and made sure db/schema.ts matched its schema
// There must be some way to create the table if it doesnt exist from within javascript and/or the schema file
// We need to "generate" and "push" a "migration"

// WORKING
// await db.insert(users).values({
//   username: 'test1',
//   password: 'test1'
// })

// await db.insert(users).values({
//   username: 'testUsername',
//   password: 'testPassword',
//   salt: 'testSalt',
// })

// db.run(users)
console.log(await db.select().from(users).all())

// const newTable = sqliteTable('users', {
//   textCol: text('someText')
// })
// 
// db.select().from(users);

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
