import { Servers } from '../types'
import { useRef } from 'react';

export default function ChatHistory({ 
  servers,
  currentServer
}: { 
  servers: Servers,
  currentServer: string 
}) {
  const formRef = useRef<HTMLFormElement>(null)
  return (
    <>
      <div className='flex-1 overflow-auto mx-4 px-4 py-2 scrollbar bg-black rounded-xl' role='list' tabIndex={0}>
        {!Object.keys(servers).includes(currentServer) ? 'Please connect to a chat room' :
          servers[currentServer].chatHistory.map((msg: string, i: number) => <div className='break-words' key={i}>{msg}</div>)
        }
      </div>
      <form className='flex m-4' ref={formRef} onSubmit={(e: any) => {
        e.preventDefault();
        if (Object.keys(servers).includes(currentServer)) {
          servers[currentServer].send(e.target.message.value);
          e.target.message.value = '';
        }
      }}>
        <textarea className='flex-1 p-2 px-4 resize-none break-words rounded-l-3xl rounded-r-none innerScrollbar' name='message' rows={2} required onKeyDown={(e: any) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            // e.preventDefault();
            // ref.current.dispatchEvent(new Event('submit'))
            // console.log(ref.current.reportValidity())
            if (formRef.current?.reportValidity() && Object.keys(servers).includes(currentServer)) {
              servers[currentServer].send(e.target.value);
              e.target.value = '';
            }
          }
        }}/>
        <button className='bg-blue-700 p-2 px-4 rounded-r-3xl rounded-l-none' type='submit'>Send</button>
      </form>
    </>
  )
}
