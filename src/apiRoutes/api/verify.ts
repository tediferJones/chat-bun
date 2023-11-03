import verifyUser from "../../modules/verifyUser"
import { ResBody } from "../../types";

export function GET(req: Request) {
  const resData: ResBody = {
    errors: [],
  }
  
  const { status, username } = verifyUser(req);

  if (status) {
    resData.username = username;
  }

  return new Response(JSON.stringify(resData))
}
