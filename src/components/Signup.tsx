/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
// import { useState } from 'react';
import NewInput from '../components/NewInput';
// import verifyInputs from '../modules/verifyInputs';
import getFormInputs from '../modules/getFormInputs';
import { ResBody } from '../types';

export default function Signup() {
  // const [errorMsg, setErrorMsg] = useState<string[]>([]);
  return (
    <div className='p-8 bg-gray-800 rounded-3xl'>
      <h1>Create new account</h1>
      <form className='' onSubmit={async(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        // const inputs = getFormInputs(e.target as HTMLFormElement);
        const inputs = getFormInputs(form);
        // https://stackoverflow.com/questions/5272433/how-to-set-custom-validation-messages-for-html-forms
        // https://stackoverflow.com/questions/8597595/can-you-trigger-custom-html5-form-errors-with-javascript
        //
        // const validation = verifyInputs(inputs)
        // if (!validation.isValid) {
        //   return setErrorMsg(validation.errors)
        // }

        // WORKING
        // e.target.username.setCustomValidity('DOESNT MATCH')
        // e.target.username.reportValidity();

        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        });

        const data: ResBody = await res.json();
        console.log('RESPONSE ERRORS')
        const errors = Object.keys(data.errors);
        if (errors.length) {
          errors.forEach((input: string) => {
            form[input].setCustomValidity(data.errors[input])
          });
          form.reportValidity();
          return;
          // return setErrorMsg(data.errors);
        }

        window.location.href = '/login';
      }}>
        <NewInput inputName='username' className='mt-4 flex flex-wrap justify-evenly'/>
        <NewInput inputName='password' className='mt-4 flex flex-wrap justify-evenly'/>
        {/*
        <label className='mt-4 flex flex-wrap justify-evenly' htmlFor='username'>
          Username:
          <input id='username' name='username' type='text' required />
        </label>
        <label className='mt-4 flex flex-wrap justify-evenly' htmlFor='password'>
          Password:
          <input id='password' name='password' type='text' required />
        </label>

        <div className='text-red-700 font-bold'>
          {errorMsg.map((error: string, i: number) => <div className='mt-4 text-center' key={i}>{error}</div>)}
        </div>
        */}
        <button className='mt-4 p-2 w-full bg-blue-700'>Sign-Up</button>
      </form>
      <div className='mt-4 text-center'>Already have an account? <a className='underline' href='/login'>Log in here</a></div>
    </div>
  )
}
