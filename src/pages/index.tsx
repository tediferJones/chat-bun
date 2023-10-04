import Layout from '../Layout'
import NewConnection from '../components/NewConnection'

export default function index() {
  return (
    <Layout title='Welcome'>
      <h1>Chat, but with bun</h1>
      <NewConnection />
    </Layout>
  )
}
