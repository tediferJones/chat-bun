import Layout from 'Layout'
import ProtectPage from 'components/ProtectPage'
import ChatWindow from 'components/ChatWindow'

export default function index() {
  return (
    <Layout title='Welcome'>
      <ProtectPage>
        <ChatWindow />
      </ProtectPage>
    </Layout>
  )
}
