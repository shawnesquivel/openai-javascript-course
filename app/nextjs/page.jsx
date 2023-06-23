"use client";
import React, { useState } from "react";
import Emoji from "../components/Emoji";

// React Functional Component
const NextJSTutorial = () => {
  // Logic, functions, data goes
  const firstName = "Bryan";

  const [lastName, setLastName] = useState("");

  const handleSubmit = async () => {
    console.log("woo hoo");

    const response = await fetch("api/next", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: "Some Message", lastName }),
    });

    // JSON = JavaScript Object Notation {}
    console.log(response);

    const responseJSON = await response.json();

    console.log(responseJSON);
  };

  // Each component returns some JSX => allows us to write HTML in React BETTER!
  return (
    <div>
      <p>This is where the page appears</p>
      <p>TailWind CSS is awesome</p>
      <p className="red-font">{firstName}</p>

      {/* CTRL / or CMD / */}

      {/* STATE */}
      <div className="flex flex-col space-y-4">
        <div>
          <p>My last name is: {lastName}</p>
          <input
            type="text"
            className="outline w-32 rounded-md"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />

          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {/* EMOJI */}
      <Emoji color="green" />
      <Emoji color="green" />
      <Emoji color="green" />
    </div>
  );
};

export default NextJSTutorial;
