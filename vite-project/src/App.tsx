import React from 'react';

import './App.css';

function App() {
  // useEffect(()=>{
  //   const container = document.getElementById("custom-widget")
  //   console.log(container)
  //   const form = document.querySelector('.formm')
  //   console.log(form)

  //   const script = document.createElement("script")
  //   script.src = "https://marekbauer.github.io/hav-widget/vite-project/dist/widget.bundle.js"
  //   script.type = "text/javascript";
  //   script.async = false;

  //   const emailInput = form?.querySelector<HTMLInputElement>('input[name="email"]');
  //   const phoneInput = form?.querySelector<HTMLInputElement>('input[name="phone"]');
  //   console.log(emailInput, phoneInput)
  //   const email = emailInput?.value || '';
  //   const phone = phoneInput?.value || '';

  //   console.log(email, phone);

  //   if(!container){
  //     return;
  //   }

  //   document.head.appendChild(script);
  //    (container as HTMLElement).appendChild(script)

  // },[])

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
