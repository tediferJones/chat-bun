import { renderToReadableStream } from 'react-dom/server';
import db from './database';
import { Server, ServerWebSocket } from 'bun';

// Notes on layers folder:
// How do we make sure the api will only take requests from logged in users
// Working on a version with the api/websocket server seperate from front-end/auth
// Still working, folder is ignored
// We can now validate users in the api
//
// Chat history problem is the result of a 'Stale Closure'
//
// TO-DO:
//    - Consider moving style.css output from public to build, this way it gets completely reset everytime the server starts
//    - [ DONE ] Update login and signup pages to use forms
//      - [ DONE ] This should allow us to remove useRef 
//    - [ DONE ] Rename all api routes to .ts instead of .tsx
//    - [ DONE ] Add input validation to client and server
//    - Add more types to types file
//    - Clean up /api/getPort
//    - Style it, we want to use tabs as the "server management" interface
//    - Add salt to password verification for user auth
//    - Do we want users to be able to pick a custom color for their name?
//      - Would require re-working chatHistory container
//      - Would also require a color wheel, or just a text box and leave it on the user to lookup a custom color
//    - [ DONE ] Add an indicator for selected servername in ManageConnections component
//    - Go over all potential errors, make sure things are working or responding correctly
//      - Create errors message for 'You are already connected to this server'
//        - Also setup form to clear new server input on submit
//      - Fix error messages for new connection expanding the userInfo container vertically
//    - Clean up comments in src/style.css
//    - Add some kind of backup/default monospace font
//    - Edit chatHistory component,
//      - Scroll to bottom when new message is sent
//      - Event should only fire if user is already scrolled to the bottom of chatHistory

// THIS CAN BE REPLACED WITH TYPESCRIPT MAGIC, see here: https://bun.sh/docs/runtime/typescript#path-mapping
// All paths are based on the location of this file (the file that runs the server)
const rootPath = import.meta.dir.replace('src', '');

function cmdRun(cmd: string, currentDir?: string) {
  Bun.spawnSync(cmd.split(' '), { cwd: currentDir})
}

function newRouter(path: string) {
  return new Bun.FileSystemRouter({
    dir: rootPath + path,
    style: 'nextjs',
  })
}

function importPaths(paths: { [key: string]: string}): { [key: string]: any } {
  const routes: { [key: string] : string } = {};
  Object.keys(paths).forEach(async (path: string) => {
    routes[path] = await import(paths[path])
  })
  return routes;
}

// Remove old build files if they exist
cmdRun('rm -r build/', rootPath)
// Generate necessary tailwind classes
cmdRun('npx tailwindcss -i src/style.css -o public/style.css', rootPath)

const srcRouter = newRouter('src/pages');
// Build files for client
await Bun.build({
  entrypoints: [
    rootPath + 'src/hydrate.tsx',
    ...Object.values(srcRouter.routes),
  ],
  outdir: rootPath + 'build',
  target: 'browser',
  splitting: true,
});
// Create final routers
const buildRouter = newRouter('build/pages');
const apiRouter = newRouter('src/apiRoutes');
// console.log(apiRouter)

// Import all needed routes when server starts, so we dont have dynamically reload each route
// Should probably be pageRoutes instead of pages
// const pages = importPaths(srcRouter.routes)
const pageRoutes = importPaths(srcRouter.routes)
const apiRoutes = importPaths(apiRouter.routes)

// Can we get away with only using one 'router'?
// Routes objects already mirror paths from each router
// We just need an object like so
// { urlPath: function }
// IF urlPath starts with /api, return api response
// Theoretically, we can just move the api folder into the pages folder
// BUT, then we cant properly determine which files to build
// Is it possible to at least merge apiRouter with apiRoutes?  so we only have one object

// Clean-up expired cookies, should run once per day
setInterval(() => {
  db.query('DELETE FROM sessions WHERE expiresAt < $expiresAt').run({ $expiresAt: Date.now() })
}, 1000*60*60*24);

// We should setup the websocket server somewhere around here
const servers: { [key: string]: {
  server: Server,
  clients: ServerWebSocket[],
}} = {};

// Run server to serve HTML to user
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    console.log(req.method + ', ' + new URL(req.url).pathname)
    // console.log('Active Servers: ', servers)
    // RENAME THIS TO pageMatch
    const builtMatch = buildRouter.match(req)
    const apiMatch = apiRouter.match(req)

    if (builtMatch) {
      console.log('RETURN PAGE')
      return new Response(await renderToReadableStream(
        pageRoutes[builtMatch.name].default({ params: builtMatch.params }), {
          bootstrapScriptContent: `globalThis.PATH_TO_PAGE = "/${builtMatch.src}";`,
          bootstrapModules: ['/hydrate.js'],
        }
      ));
    }
    if (apiMatch) {
      console.log('RETURN API RESPONSE')
      const apiFunc = apiRoutes[apiMatch.name][req.method]
      return apiFunc ? apiFunc(req, servers) : 
        new Response(`API Route ${apiMatch.name} does not have a ${req.method} method`)
    } 
    console.log(`RETURN FILE`)
    const filePath = new URL(req.url).pathname;
    const directoryOptions = ['build/pages', 'build', 'public']
    // let foundFile = false;
    // Maybe rename to 'res'
    // let file;

    for (let i = 0; i < directoryOptions.length; i++) {
      const file = Bun.file(rootPath + directoryOptions[i] + filePath)
      if (await file.exists()) {
        // foundFile = true;
        // break
        return new Response(file);
      }
    }

    return new Response(JSON.stringify(`Page ${filePath} not found`), { status: 404 });
    // return foundFile ? new Response(file) :
    //   new Response(JSON.stringify(`Page ${filePath} not found`), { status: 404 })

    // console.log('resulting file:', !!file, file)
    // // If we still dont have a file, return 404
    // if (!await file?.exists()) {
    //   return new Response(JSON.stringify(`Page ${filePath} not found`), { status: 404 })
    // }

    // // console.log(filePath)
    // return new Response(file)
  }
})

console.log(`Server is running on port ${server.port}`)
