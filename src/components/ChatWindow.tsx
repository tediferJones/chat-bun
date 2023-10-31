import { useState } from 'react'
import { Servers } from '../types'
import UserInfo from './UserInfo';
import NewConnection from './NewConnection';
import ChatHistory from './ChatHistory';
import ManageConnections from './ManageConnections';
// import NewMessage from './NewMessage';

export default function ChatWindow() {
  const [servers, setServers] = useState<Servers>({})
  const [currentServer, setCurrentServer] = useState('')

  // Changing the deeply nested state of servers doesn't trigger a re-render,
  // To "fix" this, we just force a re-render by changing the state of toggle
  const [toggle, setToggle] = useState(true);
  return (
    <div className='w-screen h-screen flex flex-col'>
      <div className='flex justify-between p-4'>
        <NewConnection 
          servers={servers}
          setServers={setServers}
          setCurrentServer={setCurrentServer}
          setToggle={setToggle}
        />
        <UserInfo />
      </div>
      <ManageConnections
        servers={servers}
        currentServer={currentServer}
        setCurrentServer={setCurrentServer}
      />
      <ChatHistory
        servers={servers}
        currentServer={currentServer}
      />
      {/*
      <NewMessage
        servers={servers}
        currentServer={currentServer}
      />
      */}
    </div>
  )
}
