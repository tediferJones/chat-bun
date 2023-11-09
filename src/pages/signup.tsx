import Layout from 'Layout';
import Signup from 'components/Signup';

export default function signup() {
  return (
    <Layout title='Signup'>
      <div className='w-screen h-screen flex justify-center items-center'>
        <Signup />
      </div>
    </Layout>
  )
}
