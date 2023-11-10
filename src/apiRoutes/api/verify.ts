import verifyUser from 'modules/verifyUser';
import { ResBody } from 'types';

export function GET(req: Request) {
  const { status, username, color } = verifyUser(req);
  const resData: ResBody = {
    errors: {},
  }

  if (status) {
    resData.username = username;
    resData.color = color;
  }

  return new Response(JSON.stringify(resData))
}
