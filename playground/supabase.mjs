// Supabase x LangChainJS https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

// How Supabase Works https://supabase.com/blog/openai-embeddings-postgres-vector

// NOTE: This is an alternative to Pinecone (waitlist due to high demand)
// 1: Create account on supabase
// https://app.supabase.com/

// 2. Create table named `documents`
import { OpenAI } from "langchain/llms/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { VectorDBQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

// https://supabase.com/blog/openai-embeddings-postgres-vector#using-postgresql
console.log(process.env.SUPABASE_PRIVATE_KEY);
console.log(process.env.SUPABASE_URL);
console.log(process.env.OPENAI_API_KEY);

/** STEP 1: CONNECT TO SUPABASE */
const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const client = createClient(url, privateKey);

/** STEP 2: UPLOAD STUFF */
// The SupabaseVectorStore.fromTexts method takes four arguments: the texts to store,
// the associated metadata, the embedding function, and options for interacting with the database.
const vectorStor1e = await SupabaseVectorStore.fromTexts(
  [
    "Frontend Developer Python ",
    "Backend Developer Java",
    "AI/ML Researcher LangChain",
    "AI/ML Researcher Meta",
  ], // These are the texts you want to store in the vector store. Each text will be converted into a high-dimensional vector using an embedding function.
  [
    { first_name: "Joanna", last_name: "Smith" },
    { first_name: "Kaito", last_name: "Esquivel" },
    { first_name: "Aubrey", last_name: "Graham" },
    { first_name: "Andres", last_name: "Tatum" },
  ], // This is the metadata associated with each text. It's an array of objects, with each object corresponding to a text. The metadata can be anything you want and is not used in the embedding process, but it can be useful for identifying the texts later.
  new OpenAIEmbeddings(), // This is the function that will convert each text into a high-dimensional vector. In this case, you're using the OpenAIEmbeddings function, which uses OpenAI's GPT-3 model to create the embeddings.
  {
    client, // This is the Supabase client, which was created earlier using the createClient function. This client is used to interact with your Supabase database.
    tableName: "documents", // This is the name of the table in your Supabase database where the vectors will be stored.
    queryName: "match_documents", // This is the name of the function in your database that will be used to find the most similar vectors to a given vector. You must have previously defined this function in your database.
  }
);

const vectorStore = await SupabaseVectorStore.fromTexts(
  [
    "Frontend Developer Python",
    "Backend Developer Java",
    "AI/ML Researcher LangChain",
    "AI/ML Researcher Meta",
  ],
  [
    { first_name: "Joanna", last_name: "Smith" },
    { first_name: "Kaito", last_name: "Esquivel" },
    { first_name: "Aubrey", last_name: "Graham" },
    { first_name: "Andres", last_name: "Tatum" },
  ],
  new OpenAIEmbeddings(),
  {
    client,
    tableName: "documents",
    queryName: "match_documents",
  }
);

/** Step 3: Use a ConversationalRetrievalQAChain to interact */
const model = new OpenAI({});

const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
  k: 1,
  returnSourceDocuments: true,
});

const promptTemplate = new PromptTemplate({
  template: `Assume you are a Human Resources Director. According to the resumes, answer this question: {question}`,
  inputVariables: ["question"],
});

const prompt = "Who has experience with Python?";

const formattedPrompt = await promptTemplate.format({
  question: prompt,
});

const response = await chain.call({
  query: formattedPrompt,
});

console.log(prompt);
console.log(response);
console.log(response.sourceDocuments[0].metadata);

/** STEP 3: SIMILARITY SEARCH */
//     similaritySearch(query: string, k?: number, filter?: this["FilterType"] | undefined): Promise<Document[]>;
// const similarityRes = await vectorStore.similaritySearch("Python", 1);
// console.log({ similarityRes });
// console.log(similarityRes.metadata);

/** STEP 4: METADATA FILTER */
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase#metadata-filtering
// Same thing, just add a third parameter for the metadata filter!
// We have two AI/ML researchers, but we want to get Andres
// const metadataRes = await vectorStore.similaritySearch("Hello world", 1, {
//   first_name: "Andres",
// });

// console.log({ metadataRes });
// console.log(metadataRes.metadata);

// "No storage option exists to persist the session, which may result in unexpected behavior when using auth."
//  - this warning is displayed because the Supabase client is trying to persist the user session but cannot find a storage option.
// This isn't an issue in your case as we are not dealing with user authentication. You can safely ignore this warning.
// You can modify this later if you are going to have authentication in your app – https://supabase.com/docs/guides/auth
// We will not cover it in this course, but Supabase is a GREAT option for it!
