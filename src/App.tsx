import React from 'react';

import './App.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HardAgeVerification } from './widget';

function App() {
  return (
    <>
      <form className='formm'>
        <label>
          Phone:
          <input type='text' name='phone' value='123456789' />
        </label>
        <label>
          Email:
          <input type='email' name='email' value='test@email.cz' />
        </label>

        <div className='hav' data-apiKey='XyQhRtZu'></div>
        {/* Use this in DEV to test the component */}
        {/* <HardAgeVerification redirectUrl='https://www.seznam.cz/' /> */}
      </form>
    </>
  );
}

export default App;
