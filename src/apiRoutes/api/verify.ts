import verifyUser from 'modules/verifyUser';
// import { ResBody } from 'types';

export function GET(req: Request) {
  return new Response(JSON.stringify(verifyUser(req)))

  // const auth = verifyUser(req);
  // return new Response(JSON.stringify(
  //   auth.status ? auth : { errors: { auth: 'failed to validate user' } } as ResBody
  // ))

  // WORKING
  // const { status, username, color } = verifyUser(req);
  // const resData: ResBody = {
  //   errors: {},
  // }

  // if (status) {
  //   resData.username = username;
  //   resData.color = color;
  // }

  // return new Response(JSON.stringify(resData))
}
