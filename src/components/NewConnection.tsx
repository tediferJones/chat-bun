import { useState } from 'react';
import verifyInputs from '../modules/verifyInputs';

export default function NewConnection() {
  const [errors, setErrors] = useState<string[]>([])
  const [currentServer, setCurrentServer] = useState('');
  const [servers, setServers] = useState<{ [key: string]: any }>({});

  // This will need to be merged into servers obj, similar to how the server holds its websocket servers
  // i.e. servers = {
  //   servername: { server: aWebSocket, chatHistory: anArrayOfMessages }
  // }
  const [chatHistory, setChatHistory] = useState<string[]>([])
  // const servers: { [key: string]: any } = {}

  function submitHandler(e: any) {
    e.preventDefault();
    // const clientWebSocket = new WebSocket(`ws://localhost:8000`)
    // console.log(clientWebSocket)

    const inputs = {
      servername: e.target.servername.value
    }

    const validation = verifyInputs(inputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return
    }

    fetch('/api/getPort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }).then((res: Response) => res.json())
      .then((data: any) => {
        if (data.errors.length > 0) {
          return setErrors(data.errors)
        }

        // console.log(data)
        const ws = new WebSocket(`ws://localhost:${data.port}`);
        ws.onopen = () => console.log('WebSocket has been opened')
        ws.onclose = () => console.log('WebSocket has been closed')
        ws.onmessage = ({ data }) => {
          setChatHistory(pastMessages => [...pastMessages, data])
        }
        setServers({ ...servers, [inputs.servername]: ws })
        setCurrentServer(inputs.servername)
      })

  }

  function sendHandler(e: any) {
    e.preventDefault();
    servers[currentServer].send(e.target.message.value)
    e.target.message.value = ''
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor='servername'>Servername</label>
        <input className='border-gray-500 border-4' id='servername' name='servername' type='text' required />
        <button type='submit' className='bg-blue-500 p-4'>Connect</button>
        <div>{errors.map((error: string, i: number) => <div key={i}>{error}</div>)}</div>
      </form>
      <div>
        <h2>Active Connections</h2>
      </div>
      <button onClick={() => {
        servers[currentServer].send('SOME MESSAGE')
      }}>Send Hello World</button>
      <h1>Message Container</h1>
      <div>{chatHistory.map((message: string, i: number) => {
        return <div key={i}>{message}</div>
      })}</div>
      <form onSubmit={sendHandler}>
        <input className='border-4 border-blue-500' name='message' type='text' required />
        <button type='submit' >SEND MESSAGE</button>
      </form>
      <button onClick={() => {
        servers[currentServer].close()
      }}>Close current connection</button>
    </div>
  )
}
