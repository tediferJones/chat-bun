/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { useState } from 'react';
import verifyInputs from '../modules/verifyInputs';
import getFormInputs from '../modules/getFormInputs';
import { ResBody } from '../types';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  return (
    <div className='p-4 bg-gray-800 rounded-3xl'>
      <h1 className='mb-4'>Sign into existing account</h1>
      <form className='flex flex-col gap-4' onSubmit={async(e) => {
        e.preventDefault();
        const inputs = getFormInputs(e.target as HTMLFormElement);
        const validation = verifyInputs(inputs);
        if (!validation.isValid) {
          return setErrorMsg(validation.errors)
        }

        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs)
        });

        const data: ResBody = await res.json();
        if (data.errors.length) {
          return setErrorMsg(data.errors)
        } 
        window.location.href = '/'
      }}>
        <label className='flex justify-between' htmlFor='username'>
          Username:
          <input id='username' name='username' type='text' required />
        </label>
        <label className='flex justify-between' htmlFor='password'>
          Password:
          <input id='password' name='password' type='text' required />
        </label>
        <div className='text-red-700 font-bold'>
          {errorMsg.map((error: string, i: number) => <div className='text-center' key={i}>{error}</div>)}
        </div>
        <button className='p-2 bg-blue-700'>Log-In</button>
      </form>
      <div className='pt-4'>Don't have an account? <a className='underline' href='/signup'>Sign up here</a></div>
    </div>
  )
}
