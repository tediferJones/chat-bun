import { useState } from 'react';
import verifyInputs from '../modules/verifyInputs';

interface serverObj extends WebSocket{
  [key: string]: any,
  servername: string,
  chatHistory: string[],
}

// Stale Closure
// TO-DO
//  - [ DONE ] Add .close functions
//  - Style it, we want to use tabs as the "server management" interface
//  - Move all functions into the JSX
//  - Break it up into seperate components like, makeNewConnection, connectionManager, and chatWindow

export default function NewConenction() {
  const [errors, setErrors] = useState<string[]>([]);
  const [servers, setServers] = useState<{ [key: string]: serverObj }>({})
  const [currentServer, setCurrentServer] = useState('')

  // Changing the deeply nested state of servers doesn't trigger a re-render,
  // To "fix" this, we just force a re-render by changing the state of toggle
  const [toggle, setToggle] = useState(true);

  function submitHandler(e: any) {
    e.preventDefault();
    const servername = e.target.servername.value;
    const validation = verifyInputs({ servername });
    if (!validation.isValid) {
      return setErrors(validation.errors);
    }

    fetch('/api/getPort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ servername }),
    }).then((res: Response) => res.json())
      .then((data: any) => {
        console.log(data)
        if (data.errors.length > 0) {
          return setErrors(data.errors)
        }
        setErrors([])

        const ws = new WebSocket(`ws://localhost:${data.port}`) as serverObj;
        ws.servername = servername;
        ws.chatHistory = ['test'];
        ws.onclose = () => {
          delete servers[ws.servername];
          setToggle(oldToggle => !oldToggle)
        }
        ws.onmessage = ({ data }: { data: string }) => {
          ws.chatHistory.push(data)
          setToggle(oldToggle => !oldToggle)
        }

        setServers(oldServers => {
          oldServers[servername] = ws
          return oldServers
        })
        setCurrentServer(servername)
      })
  }

  function sendHandler(e: any) {
    e.preventDefault();
    if (Object.keys(servers).includes(currentServer)) {
      servers[currentServer].send(e.target.message.value)
      e.target.message.value = ''
    }
  }

  console.log('RE-RENDERING')

  // <div>Connected to: {currentServer}</div>
  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor='servername'>Servername</label>
        <input className='border-gray-500 border-4' id='servername' name='servername' type='text' required />
        <button type='submit' className='bg-blue-500 p-4'>Connect</button>
        <div>{errors.map((error: string, i: number) => <div key={i}>{error}</div>)}</div>
      </form>
      
      <div>{!Object.keys(servers).includes(currentServer) ? 'no chat to display' :
        <>
          {servers[currentServer].chatHistory.map((msg: string, i: number) => <div key={i}>{msg}</div>)}
        </>
      }</div>

      <div>
        <h1>ACTIVE SERVERS</h1>
        <div>{Object.keys(servers).map((servername: string, i: number) => {
          return <div key={`server${i}`}>
            <button onClick={() => {
              setCurrentServer(servername) 
            }}>{servername}</button>
            <button onClick={() => {
              servers[servername].close()
            }}>Close</button>
          </div>
        })}</div>
      </div>

      <form onSubmit={sendHandler}>
        <input className='border-4 border-blue-500' name='message' type='text' required />
        <button type='submit'>SEND MESSAGE</button>
      </form>
    </div>
  )
}
