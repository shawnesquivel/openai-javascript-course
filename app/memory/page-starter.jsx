"use client";
import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import Result from "../components/Result";

const Memory = () => {
  const [prompt, setPrompt] = useState(
    "My name is Elon. My favorite food is sushi."
  );
  const [data, setData] = useState("");
  const [error, setError] = useState(null);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(`sending ${prompt}`);
    try {
      // stuff ...
    } catch (err) {
      console.error(err);
      setError(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <PageHeader
        heading="Memory 🧠"
        description="Let's see if it can remember your name and favourite food."
      />
      <PromptBox
        prompt={prompt}
        handlePromptChange={handlePromptChange}
        handleSubmit={handleSubmit}
        error={error}
        placeHolderText={"Enter your name"}
      />
      <Result data={data} />
    </div>
  );
};

export default Memory;
