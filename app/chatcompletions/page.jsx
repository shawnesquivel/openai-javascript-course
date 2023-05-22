"use client";

import React, { useState } from "react";

// The CodeBlock component is responsible for rendering a code block
// with the appropriate styling.
const CodeBlock = ({ code }) => (
  <pre className="codeblock-chatgpt">
    <code>{code}</code>
  </pre>
);

// The parseAndRenderData function takes a string containing text and code blocks,
// and returns a series of JSX elements to render the text and code blocks with
// the appropriate formatting.
const parseAndRenderData = (data) => {
  // Split the input string into parts using triple backticks (```) as delimiters
  // for code blocks.
  const parts = data.split(/(```[\s\S]*?```)/g);

  // Iterate over the parts and create JSX elements for text and code blocks.
  const jsxParts = parts.map((part, index) => {
    // If the current part is a code block, render it using the CodeBlock component.
    if (part.startsWith("```") && part.endsWith("```")) {
      // Remove the triple backticks and any leading/trailing newlines from the code block.
      const codeText = part.slice(3, -3).replace(/^\n+|\n+$/g, "");
      return <CodeBlock key={index} code={codeText} />;
    } else {
      // If the current part is not a code block, render it as text with line breaks.
      const lines = part.split("\n");
      return (
        <React.Fragment key={index}>
          {lines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {/* Add a line break if this is not the first line */}
              {lineIndex > 0 && <br />}
              {/* Render the text */}
              <span>{line}</span>
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    }
  });

  // Return the JSX elements containing the formatted text and code blocks.
  return <>{jsxParts}</>;
};

const ChatCompletionsTutorial = () => {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(`sending ${prompt}`);
    // Make sure to modify the endpoint!
    const response = await fetch("/api/chatcompletions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: prompt }),
    });

    const searchRes = await response.json();
    console.log(searchRes);
    // setData(searchRes.result.text.replace(/`/g, ""));
    setData(searchRes.result.text);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Chat Completions 🕵🏼
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Let's redo what we've just done with ChatOpenAI instead.
      </p>
      <p className="text-lg text-gray-700 mb-4">Write a for loop in...</p>
      <div className="flex items-center mb-8">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter prompt"
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
        {data && parseAndRenderData(data)}
      </div>
    </div>
  );
};

export default ChatCompletionsTutorial;
