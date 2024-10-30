import React from 'react';

import './App.css';

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
      </form>
    </>
  );
}

export default App;
