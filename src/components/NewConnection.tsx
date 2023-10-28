import { useState } from 'react';
import { ServerObj, Servers } from '../types';
import verifyInputs from '../modules/verifyInputs';

export default function NewConnection({ 
  servers, 
  setServers, 
  setToggle,
  setCurrentServer 
}: {
  servers: Servers,
  setServers: Function,
  setToggle: Function,
  setCurrentServer: Function,
}) {
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <div>
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

        // Move all of this into the setServers call
        const ws = new WebSocket(`ws://localhost:${port}`) as ServerObj;
        ws.servername = servername;
        ws.chatHistory = [];
        ws.onclose = () => {
          delete servers[ws.servername];
          setToggle((oldToggle: boolean) => !oldToggle)
        }
        ws.onmessage = ({ data }: { data: string }) => {
          ws.chatHistory.push(data)
          setToggle((oldToggle: boolean) => !oldToggle)
        }

        setServers((oldServers: Servers) => {
          oldServers[servername] = ws
          return oldServers
        })
        setCurrentServer(servername)
      }}>
        <label htmlFor='servername'>Servername</label>
        <input className='border-gray-500 border-4' id='servername' name='servername' type='text' required />
        <button type='submit' className='bg-blue-500 p-4'>Connect</button>
        <div>{errors.map((error: string, i: number) => <div key={i}>{error}</div>)}</div>
      </form>
    </div>
  )
}
