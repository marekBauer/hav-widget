import React, { useEffect, useState } from 'react';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <form className="formm">
    <label>
      Phone:
      <input type="text" name="phone" />
    </label>
    <label>
      Email:
      <input type="email" name="email" />
    </label>
    
    <div 
      data-widget="redirect-checkbox" 
      data-api-endpoint="https://api.example.com/endpoint" 
      data-redirect-url="https://www.seznam.cz/">
    </div>
  </form>
    </>
  )
}

export default App
