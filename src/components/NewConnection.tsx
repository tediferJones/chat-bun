import { useState } from 'react';
import verifyInputs from '../modules/verifyInputs'

export default function NewConnection() {
  const [errors, setErrors] = useState<string[]>([])
  const [currentServer, setCurrentServer] = useState('');
  const [servers, setServers] = useState<{ [key: string]: any }>({});
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
      body: JSON.stringify(inputs)
    }).then((res: Response) => res.json())
      .then((data: any) => {
        if (data.errors.length > 0) {
          return setErrors(data.errors)
        }

        console.log(data)
        const ws = new WebSocket(`ws://localhost:${data.port}`);
        ws.onopen = () => console.log('WebSocket has been opened')
        ws.onclose = () => console.log('WebSocket has been closed')
        ws.onmessage = ({ data }) => console.log('MESSAGE CONTENTS: ', data)
        setServers({ ...servers, [inputs.servername]: ws })
        // servers[inputs.servername] = ws;
        // servers[inputs.servername] = new WebSocket(`ws://localhost:${data.port}`)
        // servers[inputs.servername].onmessage = ({ data }: { data: string }) => console.log(data)
        // console.log(servers)

        setCurrentServer(inputs.servername)
        // setTimeout(() => {
        //   servers[inputs.servername].send('Hello from the client')
        // }, 1000)
      })

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
        // console.log(servers)
        // console.log(servers[currentServer])
        // console.log(currentServer)
      }}>Send Hello World</button>
    </div>
  )
}
