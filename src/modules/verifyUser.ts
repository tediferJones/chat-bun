import db from '../database';

export default function verifyUser(cookies: string | null) {
  // console.log('########   INSIDE VERIFY USER   ########')
  if (cookies === null) {
    return false;
  }
  const cookiesObj: { [key: string]: string } = {}
  cookies.split('; ').forEach((cookie: string) => {
    const tuple = cookie.split('=')
    cookiesObj[tuple[0]] = tuple[1]
  })
  const token = cookiesObj['sessionToken']
  const dbResult = db.query<{
    expiresAt: number, 
    username: string,
    token: string,
  }, { 
    $token: string, 
  }>('SELECT * FROM sessions WHERE token = $token').get({ $token: token })
  // console.log(dbResult)

  // Clean-up expired cookies
  // Consider moving this somewhere else, we dont want this running on every validation request
  db.query('DELETE FROM sessions WHERE expiresAt < $expiresAt').run({ $expiresAt: Date.now() })

  // console.log('EXPIRED TOKENS')
  // console.log(test)
  // console.log('Current Time ', currentTime)
  console.log(db.query('SELECT * FROM sessions').all())

  // console.log('########   LEAVING VERIFY USER   ########')
  return Number(dbResult?.expiresAt) > Date.now()
  // return dbResult ? true : false
}
