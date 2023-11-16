import { useEffect, useState } from 'react';
import Settings from 'components/Settings';
import easyFetch from 'modules/easyFetch';
import { ResBody, UserAuth } from 'types';

export default function UserInfo() {
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);
  const [auth, setAuth] = useState<null | UserAuth>(null);

  useEffect(() => {
    (async() => {
      const resBody: ResBody = await easyFetch('/api/verify', 'GET')
      setAuth(resBody.user)
    })()
  }, [refreshToggle])

  return (
    <>
      {auth === null ? <h1>Loading...</h1> :
        !auth ? <a href='/login'>Login</a> :
          <div className='flex gap-4 justify-between w-full sm:w-min'>
            <h1 className='text-center my-auto w-1/3 sm:w-min' style={{color: auth.color}}>{auth.username}</h1> 
            <Settings color={auth.color} setRefreshToggle={setRefreshToggle} />
            <button className='px-4 p-1 bg-blue-700 w-1/3 sm:w-min' onClick={async() => {
              await easyFetch('/api/logout', 'GET', {}, true)
              window.location.href = '/login';
              setRefreshToggle(!refreshToggle)
            }}>Logout</button>
          </div>
      }
    </>
  )
}
