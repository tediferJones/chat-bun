/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import NewInput from './NewInput';
import getFormInputs from '../modules/getFormInputs';
import { verifyInputs, viewErrors } from '../modules/inputValidation';
import { ResBody } from '../types';

export default function Login() {
  return (
    <div className='p-8 bg-gray-800 rounded-3xl'>
      <h1>Sign into existing account</h1>
      <form onSubmit={async(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputs = getFormInputs(form);

        const validity = verifyInputs(inputs);
        if (!validity.isValid) {
          return viewErrors(form, validity.errors)
        }

        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs)
        });

        const data: ResBody = await res.json();
        if (Object.keys(data.errors).length) {
          return viewErrors(form, data.errors)
        }

        window.location.href = '/'
      }}>
        <NewInput inputName='username' className='mt-4 flex flex-wrap justify-between' type='text' />
        <NewInput inputName='password' className='mt-4 flex flex-wrap justify-between' type='password' />
        <button className='mt-4 p-2 bg-blue-700 w-full'>Log-In</button>
      </form>
      <div className='mt-4 text-center'>Don't have an account? <a className='underline' href='/signup'>Sign up here</a></div>
    </div>
  )
}
