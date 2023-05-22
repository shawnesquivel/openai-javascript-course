// app/agent-server/page.jsx
import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import React from "react";

const ServerComp = async () => {
  const llm = new OpenAI({
    openAIApiKey: process.env["OPENAI_API_KEY"],
    temperature: 0,
  });

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      baseUrl: "http://localhost:3000/agents",
      location: "Vancouver,British Columbia, Canada",
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];
  const input = "How many provinces in canada?";

  const agent = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description",
    verbose: true,
    agentArgs: {
      systemMessage: input,
    },
  });

  console.log("Loaded agent.");

  console.log(`Executing with input "${input}"...`);

  const result = await agent.call({ input: input });
  console.log(result);

  return (
    <div>
      <h1>Agents (Server)</h1>
      <p>Recreate the /agents with server component</p>
      <p>{result && result.output}</p>
    </div>
  );
};

export default ServerComp;
