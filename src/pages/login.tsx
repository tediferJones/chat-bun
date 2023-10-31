import Layout from '../Layout'
import Login from '../components/Login'

export default function login() {
  return (
    <Layout title='Login'>
      <div className='w-screen h-screen flex justify-center items-center'>
        <Login></Login>
      </div>
    </Layout>
  )
}
