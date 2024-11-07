import React from "react";

import "./App.css";
// Use this in DEV to test the component
// import { HardAgeVerification } from "./widget";

const VERIFICATION_API_KEY = process.env.VITE_VERIFICATION_API_KEY || "";

function App() {
  return (
    <>
      <form className="formm">
        <label>
          Phone:
          <input type="text" name="phone" defaultValue="123456789" />
        </label>
        <label>
          Email:
          <input type="email" name="email" defaultValue="test@email.cz" />
        </label>

        <div className="ageproof-cz" data-apikey={VERIFICATION_API_KEY}></div>
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
