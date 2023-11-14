import { renderToReadableStream } from 'react-dom/server';
import db from 'database';
import { BackendServers } from 'types';

// This is the error we keep randomly getting, fix it
// 86 | function cmdRun(cmd: string, currentDir?: string) {
// 87 |   Bun.spawnSync(cmd.split(' '), { cwd: currentDir})
// 88 | }
// 89 | 
// 90 | function newRouter(path: string) {
// 91 |   return new Bun.FileSystemRouter({
//              ^
// error: Unable to find directory: /home/ted/TOP-stuff/personal-projects/chat-bun/build/pages
//       at newRouter (/home/ted/TOP-stuff/personal-projects/chat-bun/src/server.tsx:91:9)
//       at /home/ted/TOP-stuff/personal-projects/chat-bun/src/server.tsx:122:20

// Notes on layers folder:
// How do we make sure the api will only take requests from logged in users
// Working on a version with the api/websocket server seperate from front-end/auth
// Still working, folder is ignored
// We can now validate users in the api
//
// Can we get away with only using one 'router'?
// Routes objects already mirror paths from each router
// We just need an object like so
// { urlPath: function }
// IF urlPath starts with /api, return api response
// Theoretically, we can just move the api folder into the pages folder
// BUT, then we cant properly determine which files to build
// Is it possible to at least merge apiRouter with apiRoutes?  so we only have one object
//
// Chat history problem is the result of a 'Stale Closure'
//
// TO-DO:
//    - Consider moving style.css output from public to build, this way it gets completely reset everytime the server starts
//    - Is it worth it to re-organize backend servers?
//      - If we use an object formatted like so: { username: ws }, we can do faster lookups
//      - This will mainly speed up /api/setColor
//    - Make all dev assets local, i.e. download fonts and icons to the public folder
//      - [ DONE ] Add some kind of backup/default monospace font
//    - Search for super comments, search for ////:
//    - What do we do with the console.log at the bottom of this file? (server.tsx)
//    - Add better return type for easyFetch
//    - Do we want to switch back to using resBody for every response?
//      - Edit resBody, delete username & color, replace with user?: UserAuth
//    - Figure out how to backup this database
//      - Can we use max's NAS as a backup location?
//      - This doesn't matter too much for this project but it may matter more on other projects
//      - Cant we just create an api route that will return a serialized version of the database
//        - This route will have to be well protected, like an admin only route
//    - [ DONE ] Try to get rid of toggle state var again
//    - [ DONE ] Move getInputs to inputValidition module?
//      - [ DONE ] Do we ever use this function in a way that doesn't involve other parts of inputValidation?
//    - [ DONE ] Add better return type for verifyUser

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

// Import all needed routes when server starts, so we dont have dynamically reload each route
const pageRoutes = importPaths(srcRouter.routes)
const apiRoutes = importPaths(apiRouter.routes)

// Clean-up expired cookies, should run once per day
setInterval(() => {
  db.query('DELETE FROM sessions WHERE expiresAt < $expiresAt').run({ $expiresAt: Date.now() })
}, 1000*60*60*24);

// Initialize empty obj to keep track of active servers
const servers: BackendServers = {};

// Run server to serve HTML to user
const server = Bun.serve({
  async fetch(req) {
    console.log(req.method + ', ' + new URL(req.url).pathname)
    // RENAME THIS TO pageMatch
    const builtMatch = buildRouter.match(req)
    const apiMatch = apiRouter.match(req)

    if (builtMatch) {
      return new Response(await renderToReadableStream(
        pageRoutes[builtMatch.name].default({ params: builtMatch.params }), {
          bootstrapScriptContent: `globalThis.PATH_TO_PAGE = "/${builtMatch.src}";`,
          bootstrapModules: ['/hydrate.js'],
        }
      ));
    }
    if (apiMatch) {
      const apiFunc = apiRoutes[apiMatch.name][req.method];
      return apiFunc ? apiFunc(req, servers) : 
        new Response(`API Route ${apiMatch.name} does not have a ${req.method} method`);
    } 
    const filePath = new URL(req.url).pathname;
    const directoryOptions = ['build/pages', 'build', 'public'];

    for (let i = 0; i < directoryOptions.length; i++) {
      const file = Bun.file(rootPath + directoryOptions[i] + filePath)
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response(JSON.stringify(`Page ${filePath} not found`), { status: 404 });
  }
})

console.log(`Server is running on port ${server.port}`)
