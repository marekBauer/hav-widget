import React from "react";

import "./App.css";
// Use this in DEV to test the component
// import { HardAgeVerification } from "./widget";

function App() {
  return (
    <>
      <form className="formm">
        <label>
          Phone:
          <input type="text" name="phone" value="123456789" />
        </label>
        <label>
          Email:
          <input type="email" name="email" value="test@email.cz" />
        </label>

        <div className="hav" data-apikey="A3SVWCBN"></div>
        {/* Use this in DEV to test the component */}
        {/* <HardAgeVerification
          redirectUrl="https://www.seznam.cz/"
          verifyId="1"
          verifyUuid="2"
        /> */}
      </form>
    </>
  );
}

export default App;
