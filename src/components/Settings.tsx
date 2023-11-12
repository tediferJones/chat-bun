import easyFetch from "modules/easyFetch";
import { useState } from "react";

export default function Settings({ color, setRefreshToggle }: { color: string, setRefreshToggle: Function }) {
  const [colorForm, setColorForm] = useState<boolean>(false);

  return (
    <div className='flex justify-center items-center' 
      onMouseEnter={() => setColorForm(true)}
      onMouseLeave={() => setColorForm(false)}
    >
      <button className='fa-solid fa-gear bg-blue-700 p-2'
        onClick={() => setColorForm(colorForm ? false : true)}
      ></button>

      <div className='absolute h-8 w-8 top-8'></div>

      <form className={`flex gap-4 absolute top-14 bg-gray-800 p-4 rounded-full${colorForm ? '' : ' hidden'}`}
        onSubmit={async (e) => {
          e.preventDefault();
          setRefreshToggle((oldToggle: boolean) => !oldToggle)
          // Should probably do some error handling or input validation here
          await easyFetch('/api/setColor', 'POST', { color: e.currentTarget.color.value })
        }}
      >
        <input className='my-auto' name='color' type='color' defaultValue={color}/>
        <button className='bg-blue-700 rounded-full p-1 px-4' type='submit'>Set Color</button>
      </form>
    </div>
  )
}
