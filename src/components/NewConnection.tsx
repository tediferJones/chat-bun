import { useState, useEffect } from 'react';
import verifyInputs from '../modules/verifyInputs';
// import ChatHistory from './ChatHistory';

interface serverObj extends WebSocket{
  [key: string]: any,
  servername?: string,
  chatHistory?: string[],
}

export default function NewConenction() {
  // const [errors, setErrors] = useState<string[]>([]);
  // const [servername, setServername] = useState<string>('');
  // const [servers, setServers] = useState<{ [key: string]: serverObj }>({})
  const servers: { [key: string]: any } = {};
  const [currentServer, setCurrentServer] = useState('')
  const [chatHistory, setChatHistory] = useState<string[]>([])

  // function setChatHistory(servers: { [key: string]: serverObj }, servername: string, message: string) {

  //   console.log(servers, servername, message)
  //   servers[servername].chatHistory?.push(message)
  //   // server.chatHistory ? server.chatHistory.push(message) : console.log('cant find chathistory')
  //   return servers
  // }

  function submitHandler(e: any) {
    e.preventDefault();
    // const clientWebSocket = new WebSocket(`ws://localhost:8000`)
    // console.log(clientWebSocket)

    const inputs = {
      servername: e.target.servername.value
    }

    const validation = verifyInputs(inputs);
    if (!validation.isValid) {
      // setErrors(validation.errors);
      console.log('There be errors and shit homie')
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
          // return setErrors(data.errors)
          console.log('There be errors and shit homie')
          return
        }

        // console.log(data)
        const ws: serverObj = new WebSocket(`ws://localhost:${data.port}`);
        ws.onmessage = ({data}) => {
          console.log(data)
          // const div = document.createElement('div')
          // div.textContent = data
          // document.querySelector('#chatContainer')?.appendChild(div)
          servers[inputs.servername].chatHistory.push(data + ' at ' + inputs.servername)
          console.log(servers[inputs.servername].chatHistory)
          setChatHistory(servers[inputs.servername].chatHistory)
        }
        ws.servername = inputs.servername;
        ws.chatHistory = ['test'];
        servers[inputs.servername] = ws
        setInterval(() => console.log(servers), 5000)
        // setInterval(() => servers[inputs.servername].chatHistory.push('WHY') && console.log(servers[inputs.servername].chatHistory), 5000)
        // setInterval(() => console.log(servers[inputs.servername].chatHistory), 5000)
        // setInterval(() => {
        //   const div = document.createElement('div')
        //   div.textContent = 'what the fuck'
        //   document.querySelector('#chatContainer')?.appendChild(div)
        // }, 5000)
        setCurrentServer(inputs.servername)
        // setServers({
        //   ...servers,
        //   [inputs.servername]: ws,
        // })
        // console.log(inputs.servername)
        // setTimeout(() => {
        //   setServers(setChatHistory(servers, inputs.servername, 'hello world'))
        // }, 5000)
        // setServers({
        //   ...servers,
        //   // [inputs.servername]: {
        //   //   ...servers[inputs.servername],
        //   //   chatHistory: servers[inputs.servername]?.chatHistory?.concat('hello')
        //   // }
        // })
      })
  }

  return (
    <div>
      <div>{JSON.stringify(servers)}</div>
      <div>Connected to: {currentServer}</div>
      <form onSubmit={submitHandler}>
        <label htmlFor='servername'>Servername</label>
        <input className='border-gray-500 border-4' id='servername' name='servername' type='text' required />
        <button type='submit' className='bg-blue-500 p-4'>Connect</button>
        {/*
        <div>{errors.map((error: string, i: number) => <div key={i}>{error}</div>)}</div>
      <h1>YOU ARE CONNECTED TO: {servername}</h1>
        */}
      </form>
      <div id='chatContainer'></div>
      <div>{chatHistory.map((message: string, i: number) => <div key={i}>{message}</div>)}</div>
    </div>
  )
}

// <ChatHistory messages={servers['asdf']}/>

// DOES WORKNT WORK AND DONT KNOW WHY ROUND 2
// export default function NewConection() {
//   const [errors, setErrors] = useState<string[]>([]);
//   const [servers, setSevers] = useState<serverObj[]>([]);
//   const [servername, setServername] = useState<string>('')
//   // const [counter, setCounter] = useState<number>(4)
//   const [idk, setIdk] = useState(1)
//   const [state, setState] = useState<any>(null);
//   const [toggle, setToggle] = useState(true)
//   // let idkTest = 1;
// 
//   useEffect(() => {
//     console.log('lol wot')
//     // setIdk(idk + 1)
//     // idkTest = idkTest + 1
//   }, [toggle])
// 
//   // const [idk, setIdk] = useState<string[]>([])
//   function getServers() {
//     return servers;
//   }
// 
//   function submitHandler(e: any) {
//     e.preventDefault();
//     // const clientWebSocket = new WebSocket(`ws://localhost:8000`)
//     // console.log(clientWebSocket)
// 
//     const inputs = {
//       servername: e.target.servername.value
//     }
// 
//     const validation = verifyInputs(inputs);
//     if (!validation.isValid) {
//       setErrors(validation.errors);
//       return
//     }
// 
//     fetch('/api/getPort', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(inputs),
//     }).then((res: Response) => res.json())
//       .then((data: any) => {
//         console.log(data)
//         if (data.errors.length > 0) {
//           return setErrors(data.errors)
//         }
// 
//         // console.log(data)
//         const ws: serverObj = new WebSocket(`ws://localhost:${data.port}`);
//         ws.onmessage = (test: any) => {
//           setSevers(oldServers => {
//             oldServers.forEach((server: serverObj) => {
//               if (server.servername === inputs.servername) {
//                 // console.log('FOUND SERVER')
//                 server.chatHistory?.push(test.data)
//                 console.log(server.chatHistory)
//                 setState(server.chatHistory)
//               }
//             })
//             // console.log('RESULTING SERVERS')
//             // console.log(oldServers)
//             return oldServers
//           })
//           console.log('SHOWING CURRENT SERVERS')
//           console.log(servers)
//           console.log(getServers())
//           setTimeout(() => setToggle(!toggle) && console.log(toggle), 1000)
//           // console.log(counter)
//           // setCounter(counter + 1)
//         }
//         ws.servername = inputs.servername;
//         ws.chatHistory = []
//         console.log(ws)
//         // console.log('SETTING STATE')
//         // console.log(servers.concat(ws))
//         // console.log(counter)
//         // setCounter(counter + 1)
//         // setSevers([])
//         setSevers(servers.concat(ws))
//         setServername(inputs.servername)
//       })
//   }
// 
//   function sendHandler(e: any) {
//     e.preventDefault();
//     // console.log('SENDING', e.target.message.value, servername, servers)
//     // servers[servername].server.send(e.target.message.value)
//     // servers[servername].send(e.target.message.value)
//     servers.forEach((server: serverObj) => {
//       if (server.servername === servername) {
//         console.log('SENDING MESSAGE')
//         server.send(e.target.message.value)
//       }
//     })
//     // currentServer.server.send(e.target.message.value)
//     e.target.message.value = ''
//   }
// 
//   // const [whatTheFuck, setWhatTheFuck] = useState<string[]>([])
//   // const theServer = servers.filter((server: serverObj) => server.servername === servername)
//   // let idkTest;
//   // if (theServer.length) {
//   //   console.log('FOUND A THING')
//   //   idkTest = theServer[0].chatHistory
//   //   if (idkTest) {
//   //     console.log('SETTING THE CLUSTER FUCK')
//   //     setWhatTheFuck(idkTest)
//   //   }
//   // } else {
//   //   console.log('No servers with matching servername were found')
//   // }
//   // console.log('SERVER AS CONST')
//   // console.log(theServer)
//   // console.log(idkTest)
// 
//       // <h1>{JSON.stringify(whatTheFuck)}</h1>
//       // <h1>{JSON.stringify(idkTest)}</h1>
//   // const [test, setTest] = useState<{
//   //   test: {
//   //     test: {
//   //       test: string[]
//   //     }
//   //   }
//   // }>({
//   //   test: {
//   //     test: {
//   //       test: []
//   //     }
//   //   }
//   // })
//       // <h1>{JSON.stringify(idk)}</h1>
//   return (
//     <div>
//       <h1>{JSON.stringify(state)}</h1>
//       <h1>{JSON.stringify(servers)}</h1>
//       <h1>{JSON.stringify(servers.filter((server: serverObj) => server.servername === servername))}</h1>
//       <form onSubmit={submitHandler}>
//         <label htmlFor='servername'>Servername</label>
//         <input className='border-gray-500 border-4' id='servername' name='servername' type='text' required />
//         <button type='submit' className='bg-blue-500 p-4'>Connect</button>
//         <div>{errors.map((error: string, i: number) => <div key={i}>{error}</div>)}</div>
//       </form>
//       <h1>YOU ARE CONNECTED TO: {servername}</h1>
//       <form onSubmit={sendHandler}>
//         <input className='border-4 border-blue-500' name='message' type='text' required />
//         <button type='submit'>SEND MESSAGE</button>
//       </form>
//       <div>
//         <h1>TESTING AREA</h1>
//         <h1>{JSON.stringify(idk)}</h1>
//         <button onClick={() => {
//           setToggle(!toggle)
//         // <div>{JSON.stringify(test.test.test.test)}</div>
//           // setTest({
//           //   ...test,
//           //   test: {
//           //     test: {
//           //       test: test.test.test.test.concat('hello')
//           //     }
//           //   }
//           // })
//         }}>Click Here</button>
//       </div>
//     </div>
//   )
// }

// OLD AND BROKEN AND WE DONT KNOW WHY
// interface serverObj {
//   server: WebSocket,
//   chatHistory: string[],
//   servername?: string,
// }
// 
// export default function NewConnection() {
//   const [errors, setErrors] = useState<string[]>([])
//   // const [currentServer, setCurrentServer] = useState('');
//   // const [currentServer, setCurrentServer] = useState<serverObj>({
//   //   server: null,
//   //   chatHistory: [],
//   // });
//   // const [test, setTest] = useState<string[]>([])
//   // const [servername, setServername] = useState<string>('')
//   // const [servers, setServers] = useState<{ [key: string]: any }>({});
//   // const [servers, setServers] = useState<{ [key: string]: serverObj }>({});
//   const servers: { [key: string]: serverObj } = ({});
//   let servername: string = ''
// 
//   // This will need to be merged into servers obj, similar to how the server holds its websocket servers
//   // i.e. servers = {
//   //   servername: { server: aWebSocket, chatHistory: anArrayOfMessages }
//   // }
//   const [chatHistory, setChatHistory] = useState<string[]>([])
//   // const servers: { [key: string]: any } = {}
// 
//   function submitHandler(e: any) {
//     e.preventDefault();
//     // const clientWebSocket = new WebSocket(`ws://localhost:8000`)
//     // console.log(clientWebSocket)
// 
//     const inputs = {
//       servername: e.target.servername.value
//     }
// 
//     const validation = verifyInputs(inputs);
//     if (!validation.isValid) {
//       setErrors(validation.errors);
//       return
//     }
// 
//     fetch('/api/getPort', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(inputs),
//     }).then((res: Response) => res.json())
//       .then((data: any) => {
//         console.log(data)
//         if (data.errors.length > 0) {
//           return setErrors(data.errors)
//         }
// 
//         // console.log(data)
//         const ws = new WebSocket(`ws://localhost:${data.port}`);
//         ws.onopen = () => console.log('WebSocket has been opened')
//         ws.onclose = () => console.log('WebSocket has been closed')
//         ws.onmessage = ({ data }) => {
//           // setChatHistory(pastMessages => [...pastMessages, data])
//           console.log('ON MESSAGE EVENT')
//           console.log('message contents: ' +  data)
//           // setServers(oldServers => {
//           //   oldServers[inputs.servername].chatHistory.push(data)
//           //   // setServername('doody')
//           //   // setServername(inputs.servername)
//           //   // setChatHistory(oldServers[inputs.servername].chatHistory)
//           //   // setTest(oldServers[inputs.servername].chatHistory)
//           //   console.log(oldServers)
//           //   return oldServers
//           // })
//           // setServers({
//           //   ...servers,
//           //   [inputs.servername]: {
//           //     chatHistory: servers[inputs.servername].chatHistory.concat(data)
//           //   }
//           // })
//           console.log('BEFORE CHAT PUSH', servers[inputs.servername].chatHistory)
//           servers[inputs.servername].chatHistory.push(data)
//           console.log('AFTER CHAT PUSH', servers[inputs.servername].chatHistory)
//           // setChatHistory(servers[inputs.servername].chatHistory)
//         }
// 
//         // setServers({ ...servers, [inputs.servername]: ws })
//         //
//         console.log('setting server')
//         servers[inputs.servername] = {
//           server: ws,
//           chatHistory: ['WILL IT WORK'],
//           servername: inputs.servername,
//         }
//         console.log(servers)
//         servername = inputs.servername;
//         // setServers({ 
//         //   ...servers, 
//         //   [inputs.servername]: {
//         //     server: ws,
//         //     chatHistory: ['WILL IT WORK'],
//         //     servername: inputs.servername,
//         //   },
//         // })
//         //
//         // setServers(oldServers => {
//         //   console.log('setting server state')
//         //   oldServers[inputs.servername] = {
//         //     server: ws,
//         //     chatHistory: [],
//         //     servername: inputs.servername,
//         //   }
//         //   // setCurrentServer(oldServers[inputs.servername])
//         //   // setTest(oldServers[inputs.servername].chatHistory)
//         //   return oldServers;
//         // })
//         // setServers(servers)
//         // setServername(inputs.servername)
//         // setCurrentServer({
//         //     server: ws,
//         //     chatHistory: [],
//         //     servername: inputs.servername,
//         //   })
//         // setCurrentServer(inputs.servername)
//       })
//   }
// 
//   // setTimeout(() => console.log(servers, currentServer), 5000)
// 
//   function sendHandler(e: any) {
//     e.preventDefault();
//     console.log(servers)
//     // servers[currentServer].send(e.target.message.value)
//     // servers[currentServer].server.send(e.target.message.value)
//     console.log('SENDING', e.target.message.value, servername, servers)
//     servers[servername].server.send(e.target.message.value)
//     console.log('SENT')
//     // currentServer.server.send(e.target.message.value)
//     e.target.message.value = ''
//   }
//   console.log('RENDERING')
//   console.log(servers)
// 
//   return (
//     <div>
//       <form onSubmit={submitHandler}>
//         <label htmlFor='servername'>Servername</label>
//         <input className='border-gray-500 border-4' id='servername' name='servername' type='text' required />
//         <button type='submit' className='bg-blue-500 p-4'>Connect</button>
//         <div>{errors.map((error: string, i: number) => <div key={i}>{error}</div>)}</div>
//       </form>
//       <div>
//         <h2>Active Connections</h2>
//       </div>
// 
//       {/*
//       <button onClick={() => {
//         // servers[currentServer].send('SOME MESSAGE')
//         // servers[currentServer].server.send('SOME MESSAGE')
//         servers[servername].server.send('SOME MESSAGE')
//         // currentServer.server.send('SOME MESSAGE')
//       }}>Send Hello World</button>
//       */}
//       <h1>{JSON.stringify(servers)}</h1>
//       <h1>{JSON.stringify(servername)}</h1>
//       <h1>{JSON.stringify(servers[servername])}</h1>
//       <h1>{JSON.stringify(chatHistory)}</h1>
//       <h1>Message Container</h1>
//       <div>{// servers[currentServer]
//         // currentServer.chatHistory.map((message: string, i: number) => {
//         servers[servername]?.chatHistory.map((message: string, i: number) => {
//           console.log('printing messages')
//           // console.log(servers[currentServer].chatHistory)
//           // console.log(currentServer.chatHistory)
//           console.log(message)
//           return <div key={i}>{message}</div>
//       })}</div>
//       {/*
//       <form onSubmit={sendHandler}>
//       */}
//       <form onSubmit={(e) => sendHandler(e)}>
//         <input className='border-4 border-blue-500' name='message' type='text' required />
//         <button type='submit' >SEND MESSAGE</button>
//       </form>
//       <button onClick={() => {
//         // servers[currentServer].server.close()
//         servers[servername].server.close()
//         // currentServer.server.close()
//       }}>Close current connection</button>
//       <button onClick={() => {
//         // console.log(servers[currentServer].chatHistory)
//         console.log(servers[servername].chatHistory)
//         // console.log(currentServer.chatHistory)
//       // <div className='p-4 bg-green-400'>{servers[servername].servername}</div>
//       }}>Test</button>
//     </div>
//   )
// }
