import { RefObject, useState } from 'react';
import { ServerObj, Servers } from '../types';
import verifyInputs from '../modules/verifyInputs';
import UserInfo from './UserInfo';

export default function NewConnection({ 
  servers, 
  setServers, 
  setToggle,
  setCurrentServer,
  chatRef,
}: {
  servers: Servers,
  setServers: Function,
  setToggle: Function,
  setCurrentServer: Function,
  chatRef: RefObject<HTMLDivElement>,
}) {
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <div className='p-4'>
      <div className='flex justify-between'>
        <form onSubmit={async(e: any) => {
          e.preventDefault();
          const servername = e.target.servername.value;

          // Verify inputs client-side
          const validation = verifyInputs({ servername });
          if (!validation.isValid) {
            return setErrors(validation.errors);
          }

          // Fetch port from server
          const res = await fetch('/api/getPort', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ servername }),
          });
          const { errors, port } = await res.json();

          // If no errors in response, setup new websocket
          if (errors.length > 0) {
            return setErrors(errors)
          }
          setErrors([])

          // Set up new web socket connection
          const ws = new WebSocket(`ws://localhost:${port}`) as ServerObj;
          ws.servername = servername;
          ws.chatHistory = [];
          ws.onclose = () => {
            delete servers[ws.servername];
            setToggle((oldToggle: boolean) => !oldToggle)
          }
          ws.onmessage = ({ data }: { data: string }) => {
            if (
              chatRef.current?.scrollHeight && 
                chatRef.current.scrollTop && 
                chatRef.current?.scrollHeight - chatRef.current?.scrollTop === chatRef.current?.clientHeight
            ) {
              console.log("THATS THE BOTTOM OF THE CONTAINER")
              setTimeout(() => chatRef.current ? chatRef.current.scrollTop = chatRef.current.scrollHeight : console.log('FAILED'), 50)
            }

            // const { scrollHeight, scrollTop, clientHeight } = chatRef?.current ? chatRef.current :  {
            //   scrollHeight: 0,
            //   scrollTop: 0, 
            //   clientHeight: 0,
            // };

            ws.chatHistory.push(data)
            setToggle((oldToggle: boolean) => !oldToggle)
          }

          setServers((oldServers: Servers) => {
            oldServers[servername] = ws
            return oldServers
          })
          setCurrentServer(servername)
        }}>
          <label className='px-2' htmlFor='servername'>Servername</label>
          <input className='p-1 px-2 bg-gray-600' id='servername' name='servername' type='text' required />
          <button className='bg-blue-700 p-1 px-4 mx-4' type='submit'>Connect</button>
        </form>
        <UserInfo />
      </div>
      <div className='text-red-700 font-bold px-2'>{errors.map((error: string, i: number) => <div className='pt-4' key={i}>{error}</div>)}</div>
    </div>
  )
}
