import { useState } from 'react';
import verifyInputs from '../modules/verifyInputs';

interface serverObj {
  server: WebSocket,
  chatHistory: string[],
  servername?: string,
}

export default function NewConnection() {
  const [errors, setErrors] = useState<string[]>([])
  // const [currentServer, setCurrentServer] = useState('');
  // const [currentServer, setCurrentServer] = useState<serverObj>({
  //   server: null,
  //   chatHistory: [],
  // });
  // const [test, setTest] = useState<string[]>([])
  // const [servername, setServername] = useState<string>('')
  // const [servers, setServers] = useState<{ [key: string]: any }>({});
  // const [servers, setServers] = useState<{ [key: string]: serverObj }>({});
  const servers: { [key: string]: serverObj } = ({});
  let servername: string = ''

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
        console.log(data)
        if (data.errors.length > 0) {
          return setErrors(data.errors)
        }

        // console.log(data)
        const ws = new WebSocket(`ws://localhost:${data.port}`);
        ws.onopen = () => console.log('WebSocket has been opened')
        ws.onclose = () => console.log('WebSocket has been closed')
        ws.onmessage = ({ data }) => {
          // setChatHistory(pastMessages => [...pastMessages, data])
          console.log('ON MESSAGE EVENT')
          console.log('message contents: ' +  data)
          // setServers(oldServers => {
          //   oldServers[inputs.servername].chatHistory.push(data)
          //   // setServername('doody')
          //   // setServername(inputs.servername)
          //   // setChatHistory(oldServers[inputs.servername].chatHistory)
          //   // setTest(oldServers[inputs.servername].chatHistory)
          //   console.log(oldServers)
          //   return oldServers
          // })
          // setServers({
          //   ...servers,
          //   [inputs.servername]: {
          //     chatHistory: servers[inputs.servername].chatHistory.concat(data)
          //   }
          // })
          console.log('BEFORE CHAT PUSH', servers[inputs.servername].chatHistory)
          servers[inputs.servername].chatHistory.push(data)
          console.log('AFTER CHAT PUSH', servers[inputs.servername].chatHistory)
          // setChatHistory(servers[inputs.servername].chatHistory)
        }

        // setServers({ ...servers, [inputs.servername]: ws })
        //
        console.log('setting server')
        servers[inputs.servername] = {
          server: ws,
          chatHistory: ['WILL IT WORK'],
          servername: inputs.servername,
        }
        console.log(servers)
        servername = inputs.servername;
        // setServers({ 
        //   ...servers, 
        //   [inputs.servername]: {
        //     server: ws,
        //     chatHistory: ['WILL IT WORK'],
        //     servername: inputs.servername,
        //   },
        // })
        //
        // setServers(oldServers => {
        //   console.log('setting server state')
        //   oldServers[inputs.servername] = {
        //     server: ws,
        //     chatHistory: [],
        //     servername: inputs.servername,
        //   }
        //   // setCurrentServer(oldServers[inputs.servername])
        //   // setTest(oldServers[inputs.servername].chatHistory)
        //   return oldServers;
        // })
        // setServers(servers)
        // setServername(inputs.servername)
        // setCurrentServer({
        //     server: ws,
        //     chatHistory: [],
        //     servername: inputs.servername,
        //   })
        // setCurrentServer(inputs.servername)
      })
  }

  // setTimeout(() => console.log(servers, currentServer), 5000)

  function sendHandler(e: any) {
    e.preventDefault();
    console.log(servers)
    // servers[currentServer].send(e.target.message.value)
    // servers[currentServer].server.send(e.target.message.value)
    console.log('SENDING', e.target.message.value, servername, servers)
    servers[servername].server.send(e.target.message.value)
    console.log('SENT')
    // currentServer.server.send(e.target.message.value)
    e.target.message.value = ''
  }
  console.log('RENDERING')
  console.log(servers)

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

      {/*
      <button onClick={() => {
        // servers[currentServer].send('SOME MESSAGE')
        // servers[currentServer].server.send('SOME MESSAGE')
        servers[servername].server.send('SOME MESSAGE')
        // currentServer.server.send('SOME MESSAGE')
      }}>Send Hello World</button>
      */}
      <h1>{JSON.stringify(servers)}</h1>
      <h1>{JSON.stringify(servername)}</h1>
      <h1>{JSON.stringify(servers[servername])}</h1>
      <h1>{JSON.stringify(chatHistory)}</h1>
      <h1>Message Container</h1>
      <div>{// servers[currentServer]
        // currentServer.chatHistory.map((message: string, i: number) => {
        servers[servername]?.chatHistory.map((message: string, i: number) => {
          console.log('printing messages')
          // console.log(servers[currentServer].chatHistory)
          // console.log(currentServer.chatHistory)
          console.log(message)
          return <div key={i}>{message}</div>
      })}</div>
      {/*
      <form onSubmit={sendHandler}>
      */}
      <form onSubmit={(e) => sendHandler(e)}>
        <input className='border-4 border-blue-500' name='message' type='text' required />
        <button type='submit' >SEND MESSAGE</button>
      </form>
      <button onClick={() => {
        // servers[currentServer].server.close()
        servers[servername].server.close()
        // currentServer.server.close()
      }}>Close current connection</button>
      <button onClick={() => {
        // console.log(servers[currentServer].chatHistory)
        console.log(servers[servername].chatHistory)
        // console.log(currentServer.chatHistory)
      // <div className='p-4 bg-green-400'>{servers[servername].servername}</div>
      }}>Test</button>
    </div>
  )
}
