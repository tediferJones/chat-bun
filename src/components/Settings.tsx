import easyFetch from "modules/easyFetch";
import { useState, useRef } from "react";

export default function Settings({ color, setRefreshToggle }: { color: string, setRefreshToggle: Function }) {
  // get rid of this if possible, try to just toggle the class
  const [colorForm, setColorForm] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className='flex justify-center items-center' 
      onMouseEnter={() => setColorForm(true)}
      onMouseLeave={() => setColorForm(false)}
      // onMouseOver={() => setColorForm(true)}
      // onMouseMove={() => setColorForm(true)}
      // onMouseOut={() => setColorForm(false)}
      ref={ref}
    >
      <button className='fa-solid fa-gear bg-blue-700 p-2'
        onClick={() => {
          console.log('CLICKED')
          setColorForm((oldColorForm: boolean) => !oldColorForm)
          // setColorForm((oldColorForm: boolean) => {
          //   console.log(ref.current?.dispatchEvent(new Event('idkTest')))
          //   return oldColorForm;
          // })
        }}
      ></button>

      <div className='absolute h-8 w-8 top-8'></div>

      <form className={`flex gap-4 absolute top-14 bg-gray-800 p-4 rounded-full${colorForm ? '' : ' hidden'}`}
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('SUBMITING NEW COLOR')
          console.log(e)
          setRefreshToggle((oldToggle: boolean) => !oldToggle)
          // Should probably do some error handling or input validation here
          await easyFetch('/api/setColor', 'POST', { color: e.currentTarget.color.value })
        }}
      >
        <input className='my-auto' name='color' type='color' onChange={(e) => console.log(e.currentTarget.value)} defaultValue={color}/>
        <button className='bg-blue-700 rounded-full p-1 px-4' type='submit'>Set Color</button>
      </form>
    </div>
  )
}
