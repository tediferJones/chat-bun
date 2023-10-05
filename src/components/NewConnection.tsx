export default function NewConnection(props: any) {
  function clickHandler(e: any) {
    console.log(e)
    const clientWebSocket = new WebSocket(`ws://localhost:8000`)
    console.log(clientWebSocket)

  }
  return (
    <div>
      <label>Username</label>
      <input className='border-gray-500 border-4' type='text'/>
      <label>Servername</label>
      <input className='border-gray-500 border-4' type='number'/>
      <button className='bg-blue-500 p-4'
        onClick={clickHandler}
      >Connect</button>
    </div>
  )
}
