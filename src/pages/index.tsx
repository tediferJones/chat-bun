import Layout from '../Layout'
import NewConnection from '../components/NewConnection'
import UserInfo from '../components/UserInfo'
import ProtectPage from '../components/ProtectPage'

export default function index() {
  return (
    <Layout title='Welcome'>
      <ProtectPage>
        <h1>Chat, but with bun</h1>
        <NewConnection />
        <UserInfo />
      </ProtectPage>
    </Layout>
  )
}
