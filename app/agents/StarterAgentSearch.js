import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

// Langchain 0.052

const AgentSearch = async (prompt) => {
  const model = new OpenAI({
    openAIApiKey: process.env["OPENAI_API_KEY"],
    temperature: 0.9,
  });

  return model;
};

export default AgentSearch;
