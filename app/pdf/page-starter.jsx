"use client";

import React, { useState } from "react";
import ResultWithSources from "../components/ResultWithSources";
import PromptBox from "../components/PromptBox";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf

const PDFLoader = () => {
  const [prompt, setPrompt] = useState("How to get rich?");
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (endpoint) => {
    try {
      console.log(`sending ${prompt}`);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleSubmitQuery = async (endpoint) => {
    try {
      console.log(`sending ${prompt}`);
      //   do stuff
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <PageHeader
        heading="Ask Naval 🤔"
        description="How to get rich? How to be happy?"
      />
      <div className="flex items-center mb-8 gap-10">
        <Button
          handleSubmit={handleSubmit}
          color="pink"
          endpoint="pdfuploadtest"
          buttonText="Upload Test Data"
        />
        <Button
          handleSubmit={handleSubmit}
          color="pink"
          endpoint="pdfupload-book"
          buttonText="Upload Book 📚"
        />
      </div>
      <PromptBox
        prompt={prompt}
        handlePromptChange={handlePromptChange}
        // We can use the regular query,  or the agent.
        handleSubmit={() => {
          handleSubmitQuery("/pdfquery");
          // handleSubmitQuery("pdfquery-agent")
        }}
        placeHolderText={"How to get rich?"}
        error={error}
      />
      <ResultWithSources data={data} />
    </div>
  );
};

export default PDFLoader;
