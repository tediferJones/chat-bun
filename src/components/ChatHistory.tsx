import { Servers } from '../types'
import { useRef } from 'react';

export default function ChatHistory({ 
  servers,
  currentServer
}: { 
  servers: Servers,
  currentServer: string 
}) {
  const ref = useRef(null)
  return (
    <>
      <div className='flex-1 overflow-auto px-8 scrollbar' role='list' tabIndex={0}>
        {!Object.keys(servers).includes(currentServer) ? 'Please connect to a chat room' :
          servers[currentServer].chatHistory.map((msg: string, i: number) => <div className='break-words' key={i}>{msg}</div>)
        }
      </div>
      <form className='flex' ref={ref} onSubmit={(e: any) => {
        e.preventDefault();
        if (Object.keys(servers).includes(currentServer)) {
          servers[currentServer].send(e.target.message.value);
          e.target.message.value = '';
        }
      }}>
        <textarea className='flex-1 p-2 resize-none break-all' name='message' rows={2} required onKeyDown={(e: any) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            // e.preventDefault();
            // ref.current.dispatchEvent(new Event('submit'))
            // console.log(ref.current.reportValidity())
            // // @ts-ignore
            if (ref.current?.reportValidity() && Object.keys(servers).includes(currentServer)) {
              servers[currentServer].send(e.target.value);
              e.target.value = '';
            }
          }
        }}/>
        <button className='bg-blue-700 p-2' type='submit'>Send Message</button>
      </form>
    </>
  )
}
