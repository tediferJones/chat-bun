import { useState } from 'react';

export default function TestComponent({ message }: { message: string }) {
  const [state, setState] = useState(0);

  // <button onClick={() => console.log('Is this a working component?')}>INCREMENT</button>
  return (
    <div>
      <h1 className='bg-green-900 p-4 flex justify-center text-white'>TEST CLASS NAMES</h1>
      <h1>Hello {message}</h1>
      <h1>Counter: {state}</h1>
      <button onClick={() => setState(state + 1)}>INCREMENT</button>
      <br/>
      <button onClick={() => setState(state - 1)}>DECREMENT</button>
    </div>
  )
}
