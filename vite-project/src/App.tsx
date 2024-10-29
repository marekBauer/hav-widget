import React, { useEffect } from 'react';

import './App.css'

function App() {
  

  
  useEffect(()=>{
    const container = document.getElementById("custom-widget")
    console.log(container)

    const script = document.createElement("script")
    script.src = "https://marekbauer.github.io/hav-widget/vite-project/dist/widget.bundle.js"
  
    if(!container){
      return;
    }

    (container as HTMLElement).appendChild(script)
  
  },[])

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
      data-redirect-url="https://www.seznam.cz/">
    </div>
  </form>
    </>
  )
}

export default App
