"use client";

import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import ChatHistory from "../components/ChatHistory";
import ResultWithSources from "../components/ResultWithSources";
import Title from "../components/Title";
import TwoColumnLayout from "../components/TwoColumnLayout";
const ENDPOINT = "content-generator";
// use this for the testing
// const ENDPOINT = "web-browser";

const ContentGenerator = () => {
  // const data = await getTranscript("O_9JoimRj8w");
  const [prompt, setPrompt] = useState(
    "https://www.youtube.com/watch?v=O_9JoimRj8w"
  );
  const [topic, setTopic] = useState("Pedro Pascal");
  const [error, setError] = useState(null);
  const [firstMsg, setFirstMsg] = useState(true);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm your personal YouTube video script generator. If you give me a YouTube URL and topic, I can transform it into a unique video script. Send me a YouTube URL to get started.",
    },
  ]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };
  const handleSubmit = async () => {
    setPrompt("");
    try {
      // Push the user's message into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, type: "user", sourceDocuments: null },
      ]);

      const response = await fetch(`/api/content-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt, topic: topic, firstMsg }),
      });

      const searchRes = await response.json();

      console.log({ searchRes });

      if (!response.ok) {
        throw new Error(searchRes.error);
      }

      // Push the response into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: searchRes.output.text,
          type: "bot",
        },
      ]);
      setFirstMsg(false);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching transcript. Please try again.");
    }
  };

  return (
    <>
      <Title emoji="🧙🏾‍♂️" headingText="AI Content Generator" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="Automated Content Generator"
              boldText="Doing your own manual research is so 2022. Let's automate it."
              description="This tool uses the agents to create a unique video script for you. Head over to Module X to get started!"
            />
          </>
        }
        rightChildren={
          <>
            <ResultWithSources messages={messages} pngFile="wizard" />
            <PromptBox
              prompt={topic}
              handlePromptChange={handleTopicChange}
              handleSubmit={handleSubmit}
              error={error}
              placeHolderText={"Enter a topic"}
              disableButton={true}
              labelText="Topic"
            />
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={handleSubmit}
              placeHolderText={
                messages.length === 1
                  ? "Enter a youtube url, e.g., https://www.youtube.com/watch?v=O_9JoimRj8w"
                  : "Ask a follow up question"
              }
              error={error}
              labelText="Chat"
            />
          </>
        }
      />
    </>
  );
};

export default ContentGenerator;
