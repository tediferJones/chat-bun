import { Servers } from '../types'

export default function ChatHistory({ 
  servers,
  currentServer
}: { 
  servers: Servers,
  currentServer: string 
}) {
  return (
    <div>
      {!Object.keys(servers).includes(currentServer) ? 'no chat to display' :
        <div>
          {servers[currentServer].chatHistory.map((msg: string, i: number) => <div key={i}>{msg}</div>)}
        </div>
      }
      <form onSubmit={(e: any) => {
        e.preventDefault();
        if (Object.keys(servers).includes(currentServer)) {
          servers[currentServer].send(e.target.message.value);
          e.target.message.value = '';
        }
      }}>
        <input className='border-4 border-blue-500' name='message' type='text' required />
        <button type='submit'>SEND MESSAGE</button>
      </form>
    </div>
  )
}
