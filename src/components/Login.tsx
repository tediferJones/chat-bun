/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { useState } from 'react';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState<string>('');

  function clickHandler(e: any) {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      })
    }).then((res: Response) => res.json())
      .then((data: any) => {
        if (data.status) {
          window.location.href = '/'
        } else {
          setErrorMsg(data.errorMsg)
        }
      })
  }

  return (
    <div className='p-4 bg-blue-400'>
      <h1>Login Component</h1>
      <form onSubmit={clickHandler}>
        <label htmlFor='username'>Username</label>
        <input name='username' type='text' required />
        <div className='p-2' />
        <label htmlFor='password'>Password</label>
        <input name='password' type='text' required />
        <button className='p-2 bg-red-500'>Submit</button>
      </form>
      <div>Don't have an account? <a href='/signup'>Sign up here</a></div>
      <div className='text-red-700 font-bold'>{errorMsg}</div>
    </div>
  )
}
