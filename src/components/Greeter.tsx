export default function Greeter({ username }: { username: string }) {
  return (
    <div className='flex justify-center p-8 m-2 bg-purple-400 text-2xl text-white font-bold'>
      <h1>Hello, {username}</h1>
    </div>
  )
}
