import { renderToReadableStream } from 'react-dom/server';
import db from './database';

// EXAMPLE: https://www.npmjs.com/package/@bun-examples/react-ssr
// [ THIS IS THE FIX ] Consider creating a layout file, maybe thats part of what is causing issues
// Consider using tsconfig path aliases, make on for @root = './', @components = './src/components'
//
// DYNAMIC PAGES CANT LOAD PROPS ON CLIENT
//
// How do we allow users to login?
// We can get username/password on the server, and hash/compare the password
// How do we keep user logged in?
// When the user logs in, return a cookie, then just verify the cookie when an authotized action takes place (every message sent)
//
// Notes on layers folder:
// How do we make sure the api will only take requests from logged in users
// Working on a version with the api/websocket server seperate from front-end/auth
// Still working, folder is ignored
// We can now validate users in the api
//
// TO-DO:
//    - Consider moving style.css output from public to build, this way it gets completely reset everytime the server starts
//    - Update login and signup pages to use forms
//      - This should allow us to remove useRef 

// All paths are based on the location of this file (the file that runs the server)
const rootPath = import.meta.dir.replace('src', '');

// Delete old build dir
Bun.spawnSync(['rm', '-r', 'build/'], {
  cwd: rootPath,
})

// Generate css file from tailwind classes
Bun.spawnSync(['npx', 'tailwindcss', '-i', 'src/style.css', '-o', 'public/style.css'], {
  cwd: rootPath,
})

// Get pages to build
const srcRouter = new Bun.FileSystemRouter({
  dir: rootPath + 'src/pages',
  style: 'nextjs',
})

await Bun.build({
  entrypoints: [
    rootPath + 'src/hydrate.tsx',
    ...Object.values(srcRouter.routes),
  ],
  outdir: rootPath + 'build',
  target: 'browser',
  splitting: true,
})

const buildRouter = new Bun.FileSystemRouter({
  dir: rootPath + 'build/pages',
  style: 'nextjs',
})

const apiRouter = new Bun.FileSystemRouter({
  dir: rootPath + 'src/apiRoutes',
  style: 'nextjs',
})

// Import all pages so we dont have to dynamically import them on demand
const pages: { [key: string]: any } = {};
Object.keys(srcRouter.routes).forEach(async (path) => {
  pages[path] = await import(srcRouter.routes[path]);
})
const apiRoutes: { [key: string]: any } = {};
Object.keys(apiRouter.routes).forEach(async (path) => {
  apiRoutes[path] = await import(apiRouter.routes[path]);
})
// console.log(apiRouter)
// console.log(apiRoutes)
// console.log('############')
// console.log(srcRouter)
// console.log(buildRouter)
// console.log(pages)

// We should setup the websocket server somewhere around here
const servers: { [key: string]: any } = {
  servers: [],
  newServer: (port: number, servername: string) => {
    return Bun.serve({
      port,
      fetch: (req, server) => {
        if (server.upgrade(req)) {
          return;
        } else {
          return new Response("Upgrade failed :(", { status: 500 });
        }
      },
      websocket: {
        message(ws, message) {
          console.log('WEBSOCKET HAS RECIEVED A MESSAGE')
          console.log(ws, message)
        },
        open(ws) {
          console.log('WEBSOCKET HAS BEEN OPENED')
        }
      }
    })
  }
};
// const webSocket = Bun.serve({
//   port: 8000,
//   fetch(req, server) {
//     // upgrade the request to a WebSocket
//     if (server.upgrade(req)) {
//       return; // do not return a Response
//     }
//     return new Response("Upgrade failed :(", { status: 500 });
//   },
//   websocket: {
//     message(ws, message) {
//       console.log('WEBSOCKET HAS RECIEVED A MESSAGE')
//       console.log(ws, message)
//     },
//     open(ws) {
//       console.log('WEBSOCKET HAS BEEN OPENED')
//     }
//   }, // handlers
// });

// Clean-up expired cookies, should run once per day
setInterval(() => {
  db.query('DELETE FROM sessions WHERE expiresAt < $expiresAt').run({ $expiresAt: Date.now() })
}, 1000*60*60*24);

// Run server to serve HTML to user
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const builtMatch = buildRouter.match(req)
    const apiMatch = apiRouter.match(req)
    // const srcMatch = srcRouter.match(req)
    // console.log(pages)
    // console.log(req.url)
    console.log(req.method + ', ' + new URL(req.url).pathname)
    // console.log(builtMatch)
    // console.log(apiRoutes)
    // console.log(pages)

    // if (builtMatch && builtMatch.pathname !== builtMatch.name + '.js') {
    if (builtMatch) {
      console.log('RETURN PAGE')
      // console.log("MATCHED PAGE")
      // console.log(builtMatch)
      // const stream = await renderToReadableStream(pages[builtMatch.name].default({ params: builtMatch.params }), {
      //   bootstrapScriptContent: `globalThis.PATH_TO_PAGE = "/${builtMatch.src}";`,
      //   bootstrapModules: ['/hydrate.js'],
      // });

      // return new Response(stream);

      return new Response(await renderToReadableStream(
        pages[builtMatch.name].default({ params: builtMatch.params }), {
          bootstrapScriptContent: `globalThis.PATH_TO_PAGE = "/${builtMatch.src}";`,
          bootstrapModules: ['/hydrate.js'],
        }
      ));
    } else if (apiMatch) {
      console.log('RETURN API RESPONSE')
      // console.log(apiMatch)

      // console.log(apiMatch.name)
      // console.log(req.method)
      const apiFunc = apiRoutes[apiMatch.name][req.method]
      return apiFunc ? apiFunc(req, servers) : 
        new Response(`API Route ${apiMatch.name} does not have a ${req.method} method`)
      // if (apiFunc) {
      //   return apiFunc(req, servers)
      // } else {
      //   return new Response(`API Route ${apiMatch.name} does not have a ${req.method} method`)
      // }

      // return apiRoutes[apiMatch.name][req.method](req, servers)
    } else {
      console.log(`RETURN FILE`)

      const filePath = new URL(req.url).pathname;
      const directoryOptions = ['build/pages', 'build', 'public']
      // Maybe rename to 'res'
      let file;

      for (let i = 0; i < directoryOptions.length; i++) {
        file = Bun.file(rootPath + directoryOptions[i] + filePath)
        if (await file.exists()) {
          break
        }
      }

      // If we still dont have a file, return 404
      if (!await file?.exists()) {
        return new Response(JSON.stringify(`Page ${filePath} not found`), { status: 404 })
      }

      // console.log(filePath)
      return new Response(file)
    }
  }
})

console.log(`Server is running on port ${server.port}`)
