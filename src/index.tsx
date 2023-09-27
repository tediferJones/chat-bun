import { renderToReadableStream } from 'react-dom/server';

// EXAMPLE: https://www.npmjs.com/package/@bun-examples/react-ssr
// [ THIS IS THE FIX ] Consider creating a layout file, maybe thats part of what is causing issues
// Consider using tsconfig path aliases, make on for @root = './', @components = './src/components'
//
// DYNAMIC PAGES CANT LOAD PROPS ON CLIENT

// All paths are based on the location of this file (the file that runs the server)
const rootPath = import.meta.dir.replace('src', '');

const srcRouter = new Bun.FileSystemRouter({
  dir: rootPath + 'src/pages',
  style: 'nextjs',
})
// console.log(srcRouter)
// console.log(srcRouter.routes)
// console.log(Object.values(srcRouter.routes))

// Generate css file from tailwind classes
Bun.spawn(['npx', 'tailwindcss', '-i', 'src/input.css', '-o', 'public/output.css'], {
  cwd: rootPath,
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
// console.log(buildRouter)

const apiRouter = new Bun.FileSystemRouter({
  dir: rootPath + 'src/apiRoutes',
  style: 'nextjs',
})
// console.log(srcRouter)

const pages: { [key: string]: any } = {};
Object.keys(srcRouter.routes).forEach(async (path) => {
  pages[path] = await import(srcRouter.routes[path]);
})
const apiRoutes: { [key: string]: any } = {};
Object.keys(apiRouter.routes).forEach(async (path) => {
  apiRoutes[path] = await import(apiRouter.routes[path]);
})

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const builtMatch = buildRouter.match(req)
    const apiMatch = apiRouter.match(req)
    // const srcMatch = srcRouter.match(req)
    // console.log(pages)
    console.log(req.url)

    if (builtMatch && builtMatch.pathname !== builtMatch.name + '.js') {
    // if (builtMatch) {
      console.log('requesting page')
      console.log("MATCHED PAGE")
      console.log(builtMatch)
      // const stream = await renderToReadableStream(<PageToRender.default />, {
      // const stream = await renderToReadableStream(<pages[builtMatch.name] />, {
      const stream = await renderToReadableStream(pages[builtMatch.name].default({ params: builtMatch.params }), {
        bootstrapScriptContent: `globalThis.PATH_TO_PAGE = "/${builtMatch.src}";`,
        bootstrapModules: ['/hydrate.js'],
      });

      return new Response(stream);
    } else if (apiMatch) {
      return apiRoutes[apiMatch.name][req.method](req)
    } else {
      console.log(`REQUESTING FILE`)

      let filePath = new URL(req.url).pathname;
      console.log('FILE PATH')
      console.log(filePath)
      // Maybe rename to 'res'
      let file;

      const paths = [
        (filePath: string) => rootPath + 'build/pages' + filePath,
        (filePath: string) => rootPath + 'build' + filePath,
        (filePath: string) => rootPath + 'public' + filePath,
      ];
      for (let i = 0; i < paths.length; i++) {
        file = Bun.file(paths[i](filePath))
        if (await file.exists()) {
          break
        }
      }

      // console.log(`file exists?: ${!!file}`)
      if (file && !await file.exists()) {
        return new Response(`Page ${filePath} not found`, { status: 404 })
      }

      // console.log(filePath)
      return new Response(file)
    }
  }
})

console.log(`Server is running on port ${server.port}`)
