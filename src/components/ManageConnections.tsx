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
        return <div className='flex-1 flex justify-between bg-gray-700 m-2 rounded-xl' key={`server${i}`}>
          <button className='p-2 flex-1 text-left' onClick={() => {
            setCurrentServer(servername) 
          }}>{servername}</button>
          <button className='ml-2 p-2 px-4 hover:bg-red-700 rounded-r-xl' onClick={() => {
            servers[servername].close()
          }}><i className="fa-solid fa-xmark flex justify-center items-center"></i></button>
        </div>
      })}
    </div>
  )
}
