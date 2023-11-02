import { Servers } from '../types'
import { RefObject, useRef } from 'react';

export default function ChatHistory({ 
  servers,
  currentServer,
  chatRef,
}: { 
  servers: Servers,
  currentServer: string,
  chatRef: RefObject<HTMLDivElement>,
}) {
  const formRef = useRef<HTMLFormElement>(null)
  return (
    <>
      <div className='flex-1 overflow-auto mx-4 px-4 py-2 scrollbar bg-black rounded-xl'
        role='list'
        tabIndex={0}
        ref={chatRef}
      >
        {!Object.keys(servers).includes(currentServer) ? 'Please connect to a chat room' :
          servers[currentServer].chatHistory.map((msg: string, i: number) => {
            return <div className='break-words' key={i}>{msg}</div>
          })
        }
      </div>
      <form className='flex m-4' 
        ref={formRef}
        onSubmit={(e: any) => {
          e.preventDefault();
          const message: string = e.target.message.value.trim();
          if (message && Object.keys(servers).includes(currentServer)) {
            servers[currentServer].send(message);
          }
          e.target.message.value = '';
        }}
      >
        <textarea className='flex-1 p-2 px-4 resize-none break-words rounded-l-3xl rounded-r-none innerScrollbar'
          name='message'
          rows={2}
          placeholder='Press Ctrl + Enter to send'
          required
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              formRef.current?.submitBtn.click();
            }
          }}/>
        <button className='bg-blue-700 p-2 px-4 rounded-r-3xl rounded-l-none'
          name='submitBtn'
          type='submit'
        >Send</button>
      </form>
    </>
  )
}
