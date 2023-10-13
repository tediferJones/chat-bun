import Layout from '../Layout'
import NewConnection from '../components/NewConnection'
import Login from '../components/Login'
import Signup from '../components/Signup'

export default function index() {
  return (
    <Layout title='Welcome'>
      <h1>Chat, but with bun</h1>
      <Login />
      <Signup />
      <NewConnection />
    </Layout>
  )
}
