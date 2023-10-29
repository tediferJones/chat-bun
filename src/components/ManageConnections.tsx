import { Servers } from '../types'

export default function ManageConnections({
  servers,
  setCurrentServer
}: {
  servers: Servers,
  setCurrentServer: Function,
}) {
  return (
    <div className='flex flex-wrap'>
      {Object.keys(servers).map((servername: string, i: number) => {
        return <div className='flex-1 flex justify-between p-2' key={`server${i}`}>
          <button onClick={() => {
            setCurrentServer(servername) 
          }}>{servername}</button>
          <button onClick={() => {
            servers[servername].close()
          }}>X</button>
        </div>
      })}
    </div>
  )
}
