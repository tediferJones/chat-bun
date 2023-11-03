import { useState, useRef } from 'react'
import { Servers } from '../types'
import NewConnection from './NewConnection';
import ChatHistory from './ChatHistory';
import ManageConnections from './ManageConnections';

export default function ChatWindow() {
  const [servers, setServers] = useState<Servers>({})
  const [currentServer, setCurrentServer] = useState('')

  // Changing the deeply nested state of servers doesn't trigger a re-render,
  // To "fix" this, we just force a re-render by changing the state of toggle
  const [toggle, setToggle] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  return (
    <div className='w-screen h-screen flex flex-col'>
      <NewConnection 
        servers={servers}
        setServers={setServers}
        setCurrentServer={setCurrentServer}
        setToggle={setToggle}
        chatRef={chatRef}
      />
      <ManageConnections
        servers={servers}
        currentServer={currentServer}
        setCurrentServer={setCurrentServer}
      />
      <ChatHistory
        servers={servers}
        currentServer={currentServer}
        chatRef={chatRef}
      />
    </div>
  )
}
