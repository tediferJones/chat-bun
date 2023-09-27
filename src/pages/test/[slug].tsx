import Layout from "../../Layout";

export default function Test(props: any) {
  return (
    <Layout title='get the params'>
      <div>Test page with params</div>
      <div>{JSON.stringify(props)}</div>
    </Layout>
  )
}
