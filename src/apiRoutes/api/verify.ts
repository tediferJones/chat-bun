import verifyUser from 'modules/verifyUser';
import { ResBody } from 'types';

export function GET(req: Request) {
  const { status, username } = verifyUser(req);
  const resData: ResBody = {
    // errors: [],
    errors: {},
  }

  if (status) {
    resData.username = username;
  }

  return new Response(JSON.stringify(resData))
}
