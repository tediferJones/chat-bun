import verifyUser from "../../modules/verifyUser"

export function GET(req: Request) {
  return new Response(JSON.stringify(verifyUser(req)))
}
