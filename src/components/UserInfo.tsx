import { useEffect, useState } from 'react';

export default function UserInfo() {
  const [status, setStatus] = useState<null | true | false>(null);
  const [username, setUsername] = useState<string>('')
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false)

  useEffect(() => {
    fetch('/api/verify')
      .then((res: Response) => res.json())
      .then((data: any) => {
        setStatus(data.status);
        if (data.status) {
          setUsername(data.username)
        }
      })
  }, [refreshToggle])

  return (
    <div>
      {status === null ? <h1>Loading...</h1> :
        status === false ? <a href='/login'>Login</a> :
          <>
            <h1>{username}</h1>
            <button onClick={() => {
              fetch('/api/logout')
                .then((res: Response) => res.json())
                .then((data: any) => {
                  console.log(data)
                  if (data.status) {
                    // @ts-ignore
                    window.location.href = '/login'
                  }
                })
              setRefreshToggle(!refreshToggle)
            }}>Logout</button>
          </>
      }
    </div>
  )
}
