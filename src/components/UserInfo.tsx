import { useEffect, useState } from 'react';
import { ResBody } from 'types';

export default function UserInfo() {
  const [status, setStatus] = useState<null | true | false>(null);
  const [username, setUsername] = useState<string>('')
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false)

  useEffect(() => {
    (async() => {
      const res = await fetch('/api/verify');
      const data: ResBody = await res.json();

      if (data.username) {
        setStatus(true);
        setUsername(data.username);
      } else {
        setStatus(false);
      }
    })();
  }, [refreshToggle])

  return (
    <>
      {status === null ? <h1>Loading...</h1> :
        status === false ? <a href='/login'>Login</a> :
          <div className='flex gap-4 justify-between w-full sm:w-min'>
            <h1 className='text-center my-auto w-1/3 sm:w-min'>{username}</h1>
            <button className='px-4 p-1 bg-blue-700 w-1/3 sm:w-min' onClick={async() => {
              await fetch('/api/logout');
              window.location.href = '/login';
              setRefreshToggle(!refreshToggle)
            }}>Logout</button>
          </div>
      }
    </>
  )
}
