import { Servers } from '../types';

export default function NewMessage({
  servers,
  currentServer 
}: {
  servers: Servers,
  currentServer: string
}) {
  return (
    <form onSubmit={(e: any) => {
      e.preventDefault();
      if (Object.keys(servers).includes(currentServer)) {
        servers[currentServer].send(e.target.message.value)
        e.target.message.value = ''
      }
    }}>
      <input className='border-4 border-blue-500' name='message' type='text' required />
      <button type='submit'>SEND MESSAGE</button>
    </form>
  )
}
