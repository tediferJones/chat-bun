import verifyUser from 'modules/verifyUser';
import { ResBody } from 'types';

export function GET(req: Request) {
  ////: 
  // return new Response(JSON.stringify(verifyUser(req) || false));
  const resBody: ResBody = {
    errors: {},
    user: verifyUser(req),
  }
  return new Response(JSON.stringify(resBody))
}
