import { Servers } from '../types'

export default function ManageConnections({
  servers,
  setCurrentServer
}: {
  servers: Servers,
  setCurrentServer: Function,
}) {
  return (
    <div>
      <h1>ACTIVE SERVERS</h1>
      <div>{Object.keys(servers).map((servername: string, i: number) => {
        return <div key={`server${i}`}>
          <button onClick={() => {
            setCurrentServer(servername) 
          }}>{servername}</button>
          <button onClick={() => {
            servers[servername].close()
          }}>Close</button>
        </div>
      })}</div>
    </div>
  )
}
