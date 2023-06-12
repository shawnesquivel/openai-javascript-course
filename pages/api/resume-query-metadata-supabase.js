/**
 * This endpoint is used to load the resumes into the chain, then upload them to the Pinecone database.
 * Tutorial: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/directory
 * Summarization: https://js.langchain.com/docs/modules/chains/other_chains/summarization
 * Dependencies: npm install pdf-parse
 */

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAI } from "langchain/llms/openai";
import { VectorDBQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

export default async function handler(req, res) {
  try {
    //    do stuff
    const { prompt } = req.body;

    /** Load vector database */
    /** CONNECT TO SUPABASE */
    const privateKey = process.env.SUPABASE_PRIVATE_KEY;
    if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const client = createClient(url, privateKey);

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { client, tableName: "documents", queryName: "match_documents" }
    );

    // Create Vector DBQA CHain
    const model = new OpenAI();
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 1,
      returnSourceDocuments: true,
    });

    // Prompt Template
    const promptTemplate = new PromptTemplate({
      template: `Assume you are a Human Resources Director. According to the resumes, answer this question: {question}`,
      inputVariables: ["question"],
    });

    const formattedPrompt = await promptTemplate.format({
      question: prompt,
    });

    // console.log({ formattedPrompt });

    const response = await chain.call({
      query: formattedPrompt,
    });

    console.log({ response });

    return res.status(200).json({
      // String
      output: response.text,
      //   [Document, Document]
      sourceDocuments: response.sourceDocuments,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error" });
  }
}
