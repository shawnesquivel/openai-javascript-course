"use client";

// import React, { useState } from "react";
// import ResultWithSources from "../components/ResultWithSources";
// import PromptBox from "../components/PromptBox";
// import Button from "../components/Button";
// import PageHeader from "../components/PageHeader";
// // Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
// const PDFLoader = () => {
//   const [prompt, setPrompt] = useState("How to get rich?");
//   const [data, setData] = useState("");
//   const [error, setError] = useState("");

//   const handlePromptChange = (e) => {
//     setPrompt(e.target.value);
//   };

//   const handleSubmit = async (endpoint) => {
//     try {
//       console.log(`sending ${prompt}`);
//       console.log(`using ${endpoint}`);

//       const response = await fetch(`/api/${endpoint}`, {
//         method: "GET",
//       });

//       const searchRes = await response.json();
//       console.log(searchRes);
//       setData(searchRes.text);
//       setError(""); // Clear any existing error messages
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//     }
//   };

//   const handleSubmitQuery = async (endpoint) => {
//     try {
//       console.log(`sending ${prompt}`);
//       console.log(`endpoint: ${endpoint}`);

//       const response = await fetch(`/api/${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ input: prompt }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const searchRes = await response.json();
//       console.log(searchRes);
//       setData(searchRes.result);
//       setError(""); // Clear any existing error messages
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <PageHeader
//         heading="Ask Naval 🤔"
//         description="How to get rich? How to be happy?"
//       />
//       <div className="flex items-center mb-8 gap-10">
//         <Button
//           handleSubmit={handleSubmit}
//           color="pink"
//           endpoint="pdfuploadtest"
//           buttonText="Upload Test Data"
//         />
//         <Button
//           handleSubmit={handleSubmit}
//           color="pink"
//           endpoint="pdfupload-book"
//           buttonText="Upload Book 📚"
//         />
//       </div>
//       <PromptBox
//         prompt={prompt}
//         handlePromptChange={handlePromptChange}
//         // We can use the regular query,  or the agent.
//         handleSubmit={() => {
//           handleSubmitQuery("/pdfquery");
//           // handleSubmitQuery("pdfquery-agent");
//         }}
//         placeHolderText={"How to get rich?"}
//         error={error}
//       />
//       <ResultWithSources data={data} />
//     </div>
//   );
// };

// export default PDFLoader;

import React, { useState } from "react";
import ResultWithSources from "../components/ResultWithSources";
import PromptBox from "../components/PromptBox";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import Title from "../components/Title";
import TwoColumnLayout from "../components/TwoColumnLayout";
import PageContainer from "../components/PageContainer";
import { pressStart2P, instrumentSans } from "../styles/fonts";
import "../globals.css";

const PDFLoader = () => {
  const [prompt, setPrompt] = useState("How to get rich?");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (endpoint) => {
    try {
      console.log(`sending ${prompt}`);
      console.log(`using ${endpoint}`);

      const response = await fetch(`/api/${endpoint}`, {
        method: "GET",
      });

      const searchRes = await response.json();
      console.log(searchRes);
      setData(searchRes.text);
      setError(""); // Clear any existing error messages
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleSubmitQuery = async (endpoint) => {
    try {
      // Push the user's message into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, type: "user", sourceDocuments: null },
      ]);
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

  // Display each message in the array
  const chatMessages = messages.map((message, index) => (
    <p key={index} className={message.type === "user" ? "user" : "bot"}>
      {message.text}
    </p>
  ));

  return (
    <PageContainer>
      <Title emoji="💬" headingText="PDF-GPT" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="Ask Naval Anything"
              boldText="How to get rich? How to be happy?"
              description="This tool will
            let you ask anything contained in a PDF document. This tool uses
            [insert tech] & [insert tech]. Head over to module [module #] to
            get started!"
            />

            <div className="flex items-center mb-10 gap-10">
              <Button
                handleSubmit={handleSubmit}
                endpoint="pdfuploadtest"
                buttonText="Upload Test Data ☁️"
                className="Button"
              />
              <Button
                handleSubmit={handleSubmit}
                endpoint="pdfupload-book"
                buttonText="Upload Book 📚"
                className="Button"
              />
            </div>
          </>
        }
        rightChildren={
          <>
            <ResultWithSources messages={messages} />

            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={() => handleSubmitQuery("/pdfquery")}
              placeHolderText={"How to get rich?"}
              error={error}
            />
          </>
        }
      />
    </PageContainer>
  );
};

export default PDFLoader;
