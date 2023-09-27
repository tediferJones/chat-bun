import Layout from "../Layout"
import Greeter from "../components/Greeter"

export default function index() {
  return (
    <Layout title='Welcome'>
      <h1>THE REAL HOME PAGE</h1>
      <Greeter username='TIMMY'/>
    </Layout>
  )
}
