import { Servers } from '../types'

export default function ChatHistory({ 
  servers,
  currentServer
}: { 
  servers: Servers,
  currentServer: string 
}) {
  return (
    <>
      <div className='flex-1 overflow-auto px-8' role='button' tabIndex={0}>
        {!Object.keys(servers).includes(currentServer) ? 'no chat to display' :
          servers[currentServer].chatHistory.map((msg: string, i: number) => <div key={i}>{msg}</div>)
        }
      </div>
      <form className='flex' onSubmit={(e: any) => {
        e.preventDefault();
        if (Object.keys(servers).includes(currentServer)) {
          // let i = 0
          // while (i < 20) {
          //   servers[currentServer].send(e.target.message.value)
          //   i++
          // }
          servers[currentServer].send(e.target.message.value);
          // e.target.message.value = '';
        }
      }}>
        <input className='border-4 border-blue-500 flex-1' name='message' type='text' required />
        <button type='submit'>SEND MESSAGE</button>
      </form>
    </>
  )
}
