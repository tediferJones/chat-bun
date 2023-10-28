import Layout from '../Layout'
// import NewConnection from '../components/NewConnection'
// import Chatbox from '../components/Chatbox'
// import UserInfo from '../components/UserInfo'
import ProtectPage from '../components/ProtectPage'
import ChatWindow from '../components/ChatWindow'

export default function index() {
  return (
    <Layout title='Welcome'>
      <ProtectPage>
        {/*
        <h1>Chat, but with bun</h1>
        <Chatbox />
        <UserInfo />
        */}
        <ChatWindow />
      </ProtectPage>
    </Layout>
  )
}
