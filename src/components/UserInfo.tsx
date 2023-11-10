import { useEffect, useState } from 'react';
import Settings from 'components/Settings';
import easyFetch from 'modules/easyFetch';
import { ResBody } from 'types';

export default function UserInfo() {
  // JUST PUT ALL THIS IN ONE STATE OBJ
  const [status, setStatus] = useState<null | true | false>(null);
  const [username, setUsername] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false)

  useEffect(() => {
    (async() => {
      const data: ResBody = await easyFetch('/api/verify', 'GET');
      // console.log(data)

      if (data.username) {
        setStatus(true);
        setUsername(data.username);
        if (data.color) {
          setColor(data.color);
        }
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
            <h1 className='text-center my-auto w-1/3 sm:w-min' style={{color: color}}>{username}</h1> 
            <Settings color={color} setRefreshToggle={setRefreshToggle} />
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
