import { renderToReadableStream } from 'react-dom/server';
import db from 'database';
import { BackendServers } from 'types';

function cmdRun(cmd: string, currentDir?: string) {
  Bun.spawnSync(cmd.split(' '), { cwd: currentDir});
}

function newRouter(path: string) {
  return new Bun.FileSystemRouter({
    dir: rootPath + path,
    style: 'nextjs',
  });
}

function importPaths(paths: { [key: string]: string}): { [key: string]: any } {
  const routes: { [key: string] : string } = {};
  Object.keys(paths).forEach(async (path: string) => {
    routes[path] = await import(paths[path]);
  });
  return routes;
}

const rootPath = import.meta.dir.replace('src', '');

// Remove old build files if they exist
cmdRun('rm -r build/', rootPath);
// Generate necessary tailwind classes
cmdRun('npx tailwindcss -i src/style.css -o public/style.css', rootPath);

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
const pageRouter = newRouter('build/pages');
const apiRouter = newRouter('src/apiRoutes');

// Import all needed routes when server starts, so we dont have dynamically reload each route
const pageRoutes = importPaths(srcRouter.routes);
const apiRoutes = importPaths(apiRouter.routes);

// Clean-up expired cookies, should run once per day
setInterval(() => {
  db.query('DELETE FROM sessions WHERE expiresAt < $expiresAt').run({ $expiresAt: Date.now() })
}, 1000*60*60*24);

// Initialize empty obj to keep track of active servers
const servers: BackendServers = {};

// Run server to serve HTML to user
const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    // console.log(req.method + ', ' + new URL(req.url).pathname)
    const pageMatch = pageRouter.match(req);
    const apiMatch = apiRouter.match(req);

    if (pageMatch) {
      return new Response(await renderToReadableStream(
        pageRoutes[pageMatch.name].default({ params: pageMatch.params }), {
          bootstrapScriptContent: `globalThis.PATH_TO_PAGE = "/${pageMatch.src}";`,
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
    for (const dirOpt of directoryOptions) {
      const file = Bun.file(rootPath + dirOpt + filePath);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response(JSON.stringify(`Page ${filePath} not found`), { status: 404 });
  }
});

console.log(`Server is running on port ${server.port}`)
