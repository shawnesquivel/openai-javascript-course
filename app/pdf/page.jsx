"use client";

import React, { useState } from "react";
import ResultWithSources from "../components/ResultWithSources";
import PromptBox from "../components/PromptBox";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import Title from "../components/Title";
import TwoColumnLayout from "../components/TwoColumnLayout";
import ButtonContainer from "../components/ButtonContainer";
import "../globals.css";

// This functional component is responsible for loading PDFs
const PDFLoader = () => {
  // Managing prompt, messages, and error states with useState
  const [prompt, setPrompt] = useState("How to get rich?");
  const [messages, setMessages] = useState([
    {
      text: "Hi, I'm a Naval AI. What would you like to know?",
      type: "bot",
    },
  ]);
  const [error, setError] = useState("");

  // This function updates the prompt value when the user types in the prompt box
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  // This function handles the submission of the form when the user hits 'Enter' or 'Submit'
  // It sends a GET request to the provided endpoint with the current prompt as the query
  const handleSubmit = async (endpoint) => {
    try {
      console.log(`sending ${prompt}`);
      console.log(`using ${endpoint}`);

      // A GET request is sent to the backend
      const response = await fetch(`/api/${endpoint}`, {
        method: "GET",
      });

      // The response from the backend is parsed as JSON
      const searchRes = await response.json();
      console.log(searchRes);
      setError(""); // Clear any existing error messages
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  // This function handles the submission of the user's prompt when the user hits 'Enter' or 'Submit'
  // It sends a POST request to the provided endpoint with the current prompt in the request body
  const handleSubmitPrompt = async (endpoint) => {
    try {
      setPrompt("");

      // Push the user's message into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, type: "user", sourceDocuments: null },
      ]);

      // A POST request is sent to the backend with the current prompt in the request body
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      // Throw an error if the HTTP status is not OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response from the backend as JSON
      const searchRes = await response.json();

      console.log({ searchRes });

      // Push the response into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: searchRes.result.text,
          type: "bot",
          sourceDocuments: searchRes.result.sourceDocuments,
        },
      ]);

      setError(""); // Clear any existing error messages
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  // The component returns a two column layout with various child components
  return (
    <>
      <Title emoji="💬" headingText="PDF-GPT" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="Ask Naval Anything"
              boldText="How to get rich? How to be happy?"
              description="This tool will
            let you ask anything contained in a PDF document. This tool uses
            Embeddings, Pinecone, VectorDBQAChain, and VectorStoreAgents. Head over to Module 1 to
            get started!"
            />
            <ButtonContainer>
              {/* <Button
                handleSubmit={()=>{handleSubmit('pdfupload-book')}}
                endpoint="pdfuploadtest"
                buttonText="Upload Test Data ☁️"
                className="Button"
              /> */}
              <Button
                handleSubmit={handleSubmit}
                endpoint="pdf-upload"
                buttonText="Upload Book 📚"
                className="Button"
              />
            </ButtonContainer>
          </>
        }
        rightChildren={
          <>
            <ResultWithSources messages={messages} pngFile="pdf" />
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={() => handleSubmitPrompt("/pdf-query")}
              // handleSubmit={() => handleSubmitQuery("/pdfquery-agent")}
              placeHolderText={"How to get rich?"}
              error={error}
            />
          </>
        }
      />
    </>
  );
};

export default PDFLoader;
