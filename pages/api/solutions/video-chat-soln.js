// /pages/api/transcript.js
import { YoutubeTranscript } from "youtube-transcript";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

// First, we'll initialize the chain and the chat history so that they can be preserved on multiple calls to the API
let chain;
// Remember, the chat history is where we store each human/chatbot message.
let chatHistory = [];

// DO THIS SECOND
const initializeChain = async (initialPrompt, transcript) => {
  try {
    // Initialize model with GPT-3.5
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-3.5-turbo",
    });
    // Create a text splitter, we use a smaller chunk size and chunk overlap since we are working with small sentences
    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 7,
      chunkOverlap: 3,
    });

    // Using the splitter, we create documents from a bigger document, in this case the YouTube Transcript
    const docs = await splitter.createDocuments([transcript]);

    console.log(`Loading data ${docs[0]}`);

    // Upload chunks to database as documents
    // We'll be using HNSWLib for this one.
    // The nice thing about this one is that we don't need to create any accounts or get any API keys besides our OpenAI key to use this library
    // So I find that it's nice for doing some quick prototyping.
    // But the downside is that you don't get the nice dashboard like we had in Pinecone.
    const vectorStore = await HNSWLib.fromDocuments(
      [{ pageContent: transcript }],
      new OpenAIEmbeddings()
    );

    // Just to show you, we'll also save the vector store as a file in case you want to retrieve it later.
    // We'll copy our root directory and save it as a variable
    const directory = "/Users/shawnesquivel/GitHub/yt-script-generator/";
    await vectorStore.save(directory);
    //  it will create some files for us, including a way for us to view the vector store documents which is helpful.
    // then you can access it like this:
    const loadedVectorStore = await HNSWLib.load(
      directory,
      new OpenAIEmbeddings()
    );

    // The ConversationalRetrievalQA chain builds on RetrievalQAChain to provide a chat history component.

    // To create one, you will need a retriever. In the below example, we will create one from a vectorstore, which can be created from embeddings.

    // Remember we can use the loadedVectorStore or the vectorStore, in case for example you want to scale this application up and use the same vector store to store multiple Youtube transcripts.
    chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      { verbose: true } // Add verbose option here
    );

    // It requires two inputs: a question and the chat history. It first combines the chat history and the question into a standalone question, then looks up relevant documents from the retriever, and then passes those documents and the question to a question answering chain to return a response.
    const response = await chain.call({
      question: initialPrompt,
      chat_history: chatHistory,
    });

    // Update history
    chatHistory.push({
      role: "assistant",
      content: response.text,
    });

    console.log({ chatHistory });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // DO THIS FIRST
    // First we'll destructure the prompt and firstMsg from the POST request body
    const { prompt } = req.body;
    const { firstMsg } = req.body;

    // Then if it's the first message, we want to initialize the chain, since it doesn't exist yet
    if (firstMsg) {
      console.log("Initializing chain");

      try {
        // So first of all, we want to give it our human message, which was to ask for a summary of the YouTube URL
        const initialPrompt = `Give me a summary of the transcript: ${prompt}`;

        chatHistory.push({
          role: "user",
          content: initialPrompt,
        });

        // Here, we'll use a generic YouTube Transcript API to get the transcript of a youtube video
        // As you can see, the Transcript takes videoId/videoURL has the first argument to the function
        const transcriptResponse = await YoutubeTranscript.fetchTranscript(
          prompt
        );

        // and we'll just add some error handling in case the API fails
        if (!transcriptResponse) {
          return res.status(400).json({ error: "Failed to get transcript" });
        }

        // Now let's see what that transcriptResponse looks like

        console.log({ transcriptResponse });

        // We can see that it's a big array of lines. Let's squish it down into one string first to make it easier to use.

        // We initialize the transcript string
        let transcript = "";

        // Then the forEach method calls each element in the array, e.g. line = element, and we can do something what that value

        // in this case, we'll add each line of text to the empty string variable to get a single string with the entire transcript
        transcriptResponse.forEach((line) => {
          transcript += line.text;
        });

        // Now, let's create a separate function called initialize chain
        // We'll pass in the first prompt and the context, in this case the transcript
        const response = await initializeChain(initialPrompt, transcript);
        console.log("Chain:", chain);
        console.log(response);

        // And then we'll jsut get the response back and the chatHistory
        return res.status(200).json({ output: response, chatHistory });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching transcript" });
      }

      // DO THIS THIRD
    } else {
      // If it's not the first message, we can chat with the bot
      console.log("Received question");
      try {
        console.log("Asking:", prompt);
        console.log("Chain:", chain);

        // First we'll add the user message
        chatHistory.push({
          role: "user",
          content: prompt,
        });
        // Then we'll pass the entire chat history with all the previous messages back
        const response = await chain.call({
          question: prompt,
          chat_history: chatHistory,
        });
        // And we'll add the response back as well
        chatHistory.push({
          role: "assistant",
          content: response.text,
        });

        return res.status(200).json({ output: response, chatHistory });
      } catch (error) {
        // Generic error handling
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred during the conversation." });
      }
    }
  }
}
