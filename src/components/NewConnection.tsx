export default function NewConnection(props: any) {
  return (
    <div>
      <label>Username</label>
      <input className='border-gray-500 border-4' type='text'/>
      <label>Servername</label>
      <input className='border-gray-500 border-4' type='number'/>
      <button className='bg-blue-500 p-4'
        onClick={(e) => {
          console.log(e)
        }}
      >Connect</button>
    </div>
  )
}
