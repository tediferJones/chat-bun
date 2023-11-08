import { Servers } from 'types'

export default function ManageConnections({
  servers,
  currentServer,
  setCurrentServer
}: {
  servers: Servers,
  currentServer: string,
  setCurrentServer: Function,
}) {
  return (
    <div className='flex flex-wrap mx-2'>
      {Object.keys(servers).map((servername: string, i: number) => {
        let classes = 'flex-1 flex justify-between mx-2 mb-4 rounded-full'
        if (currentServer === servername) {
          classes += ' bg-blue-700'
        } else {
          classes += ' bg-gray-600'
        }
        return <div className={classes} key={`server${i}`}>
          <button className='p-2 px-4 flex-1 text-left rounded-r-none' onClick={() => {
            setCurrentServer(servername) 
          }}>{servername}</button>
          <button className='ml-2 p-2 px-4 hover:bg-red-700 rounded-l-none' onClick={() => {
            // Select a new server when closing
            const servernames = Object.keys(servers)
            const serverIndex = servernames.indexOf(servername)
            const newCurrentServer = servernames[serverIndex + 1] || servernames[serverIndex - 1]
            
            if (newCurrentServer && servername === currentServer) {
              setCurrentServer(newCurrentServer)
            }

            servers[servername].close()
          }}><i className="fa-solid fa-xmark flex justify-center items-center"></i></button>
        </div>
      })}
    </div>
  )
}
