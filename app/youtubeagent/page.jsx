"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import Result from "../components/Result";
/**
 *
 *
 *
 * DEPRECATED. USE TRANSCRIPT-CHAT
 */
/** Using React Component */
const YouTubeTranscriptAgent = () => {
  /** State lets us change the values of these variables inside the container */
  const [prompt, setPrompt] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  /** These allow us to change the state values accordingly */
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  const handleVideoURLChange = (e) => {
    setVideoURL(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // code goes here
      console.log(`sending ${prompt}`);
      const response = await fetch("/api/youtubeagent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt, videoURL: videoURL }),
      });
      const searchRes = await response.json();
      console.log(searchRes);
      setData(searchRes);
    } catch (err) {
      console.error(err);
      setError(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <PageHeader
        heading="YouTube Agent 🕵🏼"
        description="Query YouTube video transcripts and get AI-generated responses... Try:"
      />
      <p className="mb-4">Make me a youtube video script about turtles.</p>
      <p className="mb-4">https://www.youtube.com/watch?v=O_9JoimRj8w</p>
      <input
        type="text"
        value={videoURL}
        onChange={handleVideoURLChange}
        placeholder={"Enter URL: https://www.youtube.com/watch?v=O_9JoimRj8w"}
        className="w-full mr-4 py-2 px-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded mb-4"
      />

      <PromptBox
        prompt={prompt}
        handlePromptChange={handlePromptChange}
        handleSubmit={handleSubmit}
        error={error}
      />

      <Result data={data} />
      {/* <Results data={data} /> */}
    </div>
  );
};

export default YouTubeTranscriptAgent;
