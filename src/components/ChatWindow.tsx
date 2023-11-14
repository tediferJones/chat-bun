import { useState, useRef, useEffect } from 'react'
import UserInfo from 'components/UserInfo';
import NewConnection from 'components/NewConnection';
import ManageConnections from 'components/ManageConnections';
import ChatHistory from 'components/ChatHistory';
import { Servers } from 'types';

export default function ChatWindow() {
  const [servers, setServers] = useState<Servers>({})
  const [currentServer, setCurrentServer] = useState('')

  ////:  Changing the deeply nested state of servers doesn't trigger a re-render,
  ////:  To "fix" this, we just force a re-render by changing the state of toggle
  const [toggle, setToggle] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  return (
    <div className='w-screen h-screen flex flex-col'>
      <div className='p-4 flex justify-between gap-4 flex-col-reverse sm:flex-row'>
        <NewConnection 
          servers={servers}
          setServers={setServers}
          setCurrentServer={setCurrentServer}
          setToggle={setToggle}
          chatRef={chatRef}
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
        chatRef={chatRef}
      />
    </div>
  )
}
