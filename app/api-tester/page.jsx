"use client";

import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import Result from "../components/Result";
import ChatHistory from "../components/ChatHistory";
import Input from "../components/Input";

const ENDPOINT = "web-browser";

const Test = () => {
  // const data = await getTranscript("O_9JoimRj8w");
  const [prompt, setPrompt] = useState("who is pedro pascal");
  const [topic, setTopic] = useState("");
  const [data, setData] = useState(null);
  const [chatHistory, setChatHistory] = useState(null);
  const [error, setError] = useState(null);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };
  const handleSubmit = async () => {
    try {
      console.log("prompt: ", prompt);
      console.log("topic: ", topic);

      const res = await fetch(
        `/api/${ENDPOINT}?prompt=${prompt}&topic=${topic}`
      );
      const transcriptRes = await res.json();

      if (!res.ok) {
        throw new Error(transcriptRes.error);
      }

      console.dir(transcriptRes);
      setData(transcriptRes.output);
      setChatHistory(transcriptRes.chatHistory);
      setPrompt("");
    } catch (err) {
      console.error(err);
      setData(null);
      setError("Error fetching transcript. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <PageHeader
        heading={"Test APIs 🧙🏼"}
        description={`who is pedro pascal`}
      />
      <Input
        input={topic}
        onChange={handleTopicChange}
        placeholderText={"Add topic"}
      />
      <Result data={data} />
      <ChatHistory chatHistory={chatHistory} />
      <PromptBox
        prompt={prompt}
        handlePromptChange={handlePromptChange}
        handleSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
};

export default Test;
