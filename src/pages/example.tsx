import TestComponent from '../components/testComponent';
import Layout from '../Layout';

export default function Example() {
  return (
    <Layout title='Example Page'>
      <div>
        <TestComponent message='from example page' />
      </div>
    </Layout>
  )
}

