export function GET(req: any) {
  console.log(req.body)
  return new Response('Hello from login api route')
}

export async function POST(req: Request) {
  console.log(await req.json())
  return new Response('Hello from login api POST route')
}
