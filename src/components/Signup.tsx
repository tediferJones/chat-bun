/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { useState } from 'react';
import verifyInputs from '../modules/verifyInputs';
import { ResBody } from '../types';

export default function Signup() {
  const [errorMsg, setErrorMsg] = useState<string[]>([]);

  function clickHandler(e: any) {
    e.preventDefault();
    const inputs = {
      username: e.target.username.value,
      password: e.target.password.value,
    }

    const validation = verifyInputs(inputs)

    if (!validation.isValid) {
      setErrorMsg(validation.errors)
      return
    }

    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs)
    }).then((res: Response) => res.json())
      .then((data: ResBody) => data.errors.length === 0 ? window.location.href = '/login' : setErrorMsg(data.errors))
  }

  return (
    <div className='p-4 bg-gray-800 rounded-3xl'>
      <h1 className='mb-4'>Create new account</h1>
      <form className='flex flex-col gap-4' onSubmit={clickHandler}>
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
        <button className='p-2 bg-blue-700'>Sign-Up</button>
      </form>
      <div className='mt-4'>Already have an account? <a className='underline' href='/login'>Log in here</a></div>
    </div>
  )
}
