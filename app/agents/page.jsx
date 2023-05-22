"use client";

import React, { useState, useEffect } from "react";
// import AgentSearch from "./AgentSearch";

const Summary = () => {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(`sending ${prompt}`);
    const response = await fetch("/api/agentsearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: prompt }),
    });

    const searchRes = await response.json();
    console.log(searchRes);
    setData(searchRes.output); // Assuming the API response returns the output in an 'output' key
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        How Do Agents Work?🕵🏼
      </h1>
      <ul className="list-disc pl-6 mb-8">
        <li className="text-gray-700 mb-2">
          Agent = LLM + Agent Type + Prompt + Tools
        </li>
        <li className="text-gray-700 mb-2">
          Engine (Motor) = OpenAI, HuggingFace (🤗)
        </li>
        <li className="text-gray-700 mb-2">
          Type (Personality) = ZERO_SHOT, FEW_SHOT (🤗)
        </li>
        <li className="text-gray-700 mb-2">
          Instructions (The Mystery)= Destroy all humans 🤖
        </li>
        <li className="text-gray-700 mb-2">Tools = Magnifying Glass, Guns🤖</li>
      </ul>
      <p className="text-lg text-gray-700 mb-2">What's Their Net Worth?</p>
      <div className="flex items-center mb-8">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Person"
          className="w-full mr-4 py-2 px-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />
        <button
          onClick={handleSubmit}
          className="py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Enter
        </button>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-800">{data && data}</p>
      </div>
    </div>
  );
};

export default Summary;
