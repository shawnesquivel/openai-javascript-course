"use client";
import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import Title from "../components/Title";
import TwoColumnLayout from "app/components/TwoColumnLayout";
import ResultWithSources from "../components/ResultWithSources";

import "../globals.css";

const Memory = () => {
  const [prompt, setPrompt] = useState(
    "My name is Elon. My favorite food is sushi."
  );
  const [messages, setMessages] = useState([
    {
      text: "Hi there! What's your name and favourite food?",
      type: "bot",
    },
  ]);
  const [error, setError] = useState(null);
  const [firstMsg, setFirstMsg] = useState(true);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmitPrompt = async () => {
    console.log(`sending ${prompt}`);
    try {
      setPrompt("");
      setFirstMsg(false);
      // Push the user's message into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, type: "user", sourceDocuments: null },
      ]);
      const response = await fetch(`/api/memory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt, firstMsg }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const searchRes = await response.json();
      // Push the response into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: searchRes.output.response,
          type: "bot",
        },
      ]);

      console.log({ searchRes });
      setError(""); // Clear any existing error messages
    } catch (err) {
      console.error(err);
      setError(error);
    }
  };

  return (
    <>
      <Title emoji="🧠" headingText="Memory" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="I remember everything."
              boldText="Let's see if it can remember your name and favourite food. This tool will let you ask anything contained in a PDF document. "
              description="This tool uses Buffer Memory and Conversation Chain.  Head over to Module X to get started!"
            />
          </>
        }
        rightChildren={
          <>
            <ResultWithSources messages={messages} pngFile="brain" />
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={handleSubmitPrompt}
              placeHolderText={"Enter your name"}
              error={error}
              pngFile="pdf"
            />
          </>
        }
      />
    </>
  );
};

export default Memory;
