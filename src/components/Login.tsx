import { useRef } from 'react'

export default function Login(props: any) {
  const username: { current: any } = useRef('')
  const password: { current: any } = useRef('')

  function clickHandler() {
    // console.log(e)
    console.log(username.current.value)
    console.log(password.current.value)
    fetch('/api/login', {
      redirect: 'follow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.current.value,
        password: password.current.value,
      })
    }).then((res: Response) => res.json())
      .then((data: any) => {
        if (data.status) {
          // @ts-ignore
          window.location.href = '/'
        }
      })
  }

  return (
    <div className='p-4 bg-blue-400'>
      <h1>Login Component</h1>
      <label>Username</label>
      <input type='text' ref={username} />
      <div className='p-2' />
      <label>Password</label>
      <input type='text' ref={password} />
      <button onClick={clickHandler} className='p-2 bg-red-500'>Submit</button>
      <div>Don't have an account? <a href='/signup'>Sign up here</a></div>
    </div>
  )
}
