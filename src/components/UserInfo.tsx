import { useEffect, useState } from 'react';

// What do want this to accomplish?
// Send fetch req to server, which will run "verifyUser" and return the result
// Result should contain the username if user is verified

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
        status === false ? <button>Login</button> :
          <>
            <h1>{username}</h1>
            <button onClick={() => {
              fetch('/api/logout')
              setRefreshToggle(!refreshToggle)
            }}>Logout</button>
          </>
      }
    </div>
  )
}
