import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { VectorStoreToolkit, createVectorStoreAgent } from "langchain/agents";
import { PromptTemplate } from "langchain/prompts";

export default async function handler(req, res) {
  try {
    // do stuff

    return res.status(200).json({
      output: result.output,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err });
  }
}
