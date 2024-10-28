import React, { useEffect } from 'react';

import './App.css'

function App() {
  const container = document.getElementById("custom-widget")

  console.log(container)
  
  useEffect(()=>{
    console.log(container)

    const script = document.createElement("script")
    script.src = "https://marekbauer.github.io/hav-widget/vite-project/dist/widget.bundle.js"
  
    if(!container){
      return;
    }

    (container as HTMLElement).appendChild(script)
  
  },[container])

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
      id="custom-widget"
      data-widget="redirect-checkbox" 
      data-api-endpoint="https://api.example.com/endpoint" 
      data-redirect-url="https://www.seznam.cz/">
    </div>
  </form>
    </>
  )
}

export default App
