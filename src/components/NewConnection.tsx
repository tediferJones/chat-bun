import { useState, useEffect } from 'react';
import verifyInputs from '../modules/verifyInputs';
// import ChatHistory from './ChatHistory';

interface serverObj extends WebSocket{
  [key: string]: any,
  servername: string,
  chatHistory: string[],
}

// Stale Closure
// TO-DO
//  - Add .close functions
//  - Style it, we want to use tabs as the "server management" interface
//  - Move all functions into the JSX
//  - Break it up into seperate components like, makeNewConnection, connectionManager, and chatWindow

export default function NewConenction() {
  const [errors, setErrors] = useState<string[]>([]);
  // const [servername, setServername] = useState<string>('');
  const [servers, setServers] = useState<{ [key: string]: serverObj }>({})
  // const servers: { [key: string]: any } = {};
  const [currentServer, setCurrentServer] = useState('')
  // const [chatHistory, setChatHistory] = useState<string[]>([])

  // Used to force re-renders, be careful if you mess with this
  const [toggle, setToggle] = useState(true);

  // useEffect(() => {
  //   console.log('lol wut')
  // }, [])

  function submitHandler(e: any) {
    e.preventDefault();
    // const clientWebSocket = new WebSocket(`ws://localhost:8000`)
    // console.log(clientWebSocket)

    const inputs = {
      servername: e.target.servername.value
    }

    const validation = verifyInputs(inputs);
    if (!validation.isValid) {
      return setErrors(validation.errors);
    }

    fetch('/api/getPort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }).then((res: Response) => res.json())
      .then((data: any) => {
        console.log(data)
        if (data.errors.length > 0) {
          return setErrors(data.errors)
        }
        setErrors([])

        const ws = new WebSocket(`ws://localhost:${data.port}`) as serverObj;
        ws.onmessage = ({ data }: { data: string }) => {
          // console.log(data)
          // console.log(servers)
          // console.log(currentServer)
          // console.log(ws.chatHistory)

          ws.chatHistory.push(data)
          setToggle(oldToggle => !oldToggle)

          // setServers(oldServers => {
          //   console.log('Current Server Is: ', currentServer, inputs.servername)
          //   oldServers[inputs.servername].chatHistory.push(data)
          //   console.log(oldServers[inputs.servername].chatHistory)
          //   return oldServers
          // })
          // console.log(servers[inputs.servername].chatHistory)
          // setChatHistory(servers[inputs.servername].chatHistory)
          // setToggle(!toggle)

          // if (ws.servername === currentServer) {
          //   setChatHistory(oldHistory => ws.chatHistory)
          // }
        }
        ws.servername = inputs.servername;
        ws.chatHistory = ['test'];
        setServers(oldServers => {
          oldServers[inputs.servername] = ws
          return oldServers
        })
        setCurrentServer(inputs.servername)
      })
  }

  function sendHandler(e: any) {
    e.preventDefault();
    // console.log('SENDING', e.target.message.value, servername, servers)
    servers[currentServer].send(e.target.message.value)
    e.target.message.value = ''
  }

  console.log('RE-RENDERING')

  return (
    <div>
      {/*
      <div>{JSON.stringify(servers)}</div>
      */}
      <div>Connected to: {currentServer}</div>
      <form onSubmit={submitHandler}>
        <label htmlFor='servername'>Servername</label>
        <input className='border-gray-500 border-4' id='servername' name='servername' type='text' required />
        <button type='submit' className='bg-blue-500 p-4'>Connect</button>
        <div>{errors.map((error: string, i: number) => <div key={i}>{error}</div>)}</div>
      </form>
      
      <div>{!currentServer ? 'no currentServer found' :
        <>
          {servers[currentServer].chatHistory.map((msg: string, i: number) => <div key={i}>{msg}</div>)}
        </>
      }</div>

      <div>
        <h1>ACTIVE SERVERS</h1>
        <div>{Object.keys(servers).map((servername: string, i: number) => {
          return <button key={`server${i}`} onClick={() => {
            setCurrentServer(servername) 
          }}>{servername}</button>
        })}</div>
      </div>
      <form onSubmit={sendHandler}>
        <input className='border-4 border-blue-500' name='message' type='text' required />
        <button type='submit'>SEND MESSAGE</button>
      </form>
    </div>
  )
}
