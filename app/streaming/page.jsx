"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import Result from "../components/Result";
import ResultStreaming from "../components/ResultStreaming";
import Title from "../components/Title";
import TwoColumnLayout from "app/components/TwoColumnLayout";

// Step 1: Do this setup with SSE -- will return this format
// "\n""\n""Cl""ucking"" in"" the"" barn""yard"",""\n""Fe""ather""s"" so"" sunny"" yellow"",""\n""The"" chicken"" is"" so"" grand""\n""\n""It"" may"" not"" be"" so"" handsome"",""\n""But"" it"" knows"" how"" to"" strut"",""\n""With"" a"" cock""-""a""-""d""oodle""-""d""oo""\n""It""'ll"" wake"" you"" up""\n""\n""It""'s"" a"" source"" of"" protein"",""\n""And"" it"" tastes"" so"" divine"",""\n""When"" you"" roast"" it"" up""\n""You""'ll"

const Streaming = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState("");
  const [source, setSource] = useState(null);

  const processToken = (token) => {
    // Replace special newline characters with actual line breaks
    // and remove extra quotes
    return token.replace(/\\n/g, "\n").replace(/\"/g, "");
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log(`sending ${prompt}`);
      await fetch("/api/streaming", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      if (source) {
        source.close();
      }

      const newSource = new EventSource("/api/streaming");
      setSource(newSource);

      newSource.addEventListener("newToken", (event) => {
        const token = processToken(event.data);

        setData((prevData) => prevData + token);
      });

      newSource.addEventListener("end", () => {
        // Close the connection and perform any final UI updates
        newSource.close();
      });
    } catch (err) {
      console.error(err);
      setError(error);
    }
  };

  // Clean up the EventSource on component unmount
  useEffect(() => {
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [source]);

  return (
    <>
      <Title emoji="💭" headingText="Streaming" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="Spit a Rap."
              boldText="Nobody likes waiting for APIs to load. Use streaming to improve the user experience of chat bots."
              description="This tutorial uses streaming.  Head over to Module X to get started!"
            />
          </>
        }
        rightChildren={
          <>
            <ResultStreaming data={data} />
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={handleSubmit}
              placeHolderText={"Enter your name and city"}
              error={error}
              pngFile="pdf"
            />
          </>
        }
      />
    </>
  );
};

export default Streaming;
