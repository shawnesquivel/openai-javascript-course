// /pages/api/transcript_chat.js

import { YoutubeTranscript } from "youtube-transcript";
import extractVideoId from "../../utils/extractVideoId";
import getVideoMetaData from "../../utils/getVideoMetaData";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import ResearchAgent from "../../agents/ResearchAgent";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

// Global Variables
let chain;
let chatHistory = [];
let transcript = "";
let metadataString = "";
let research;

// Initialize Chain with Data
const initChain = async (transcript, metadataString, research, topic) => {
  try {
    // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.
    const llm = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-3.5-turbo",
    });

    console.log(`Initializing Chat Prompt`);

    // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.
    // This allows us to set the template that the bot sees every time
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a helpful social media assistant that provides research, new content, and advice to me. \n You are given the transcript of the video: {transcript} \n and video metadata: {metadata} as well as additional research: {research}"
      ),
      HumanMessagePromptTemplate.fromTemplate(
        "{input}. Remember to use the video transcript and research as reference."
      ),
    ]);

    const question = `Write me a script for a new video that provides commentary on this video in a lighthearted, joking manner. It should compliment ${topic} with puns.`;
    console.log(question);

    chain = new LLMChain({
      prompt: chatPrompt,
      llm: llm,
      // memory,
    });

    const response = await chain.call({
      transcript,
      metadata: metadataString,
      research,
      input: question,
    });

    console.log({ response });

    chatHistory.push({
      role: "assistant",
      content: response.text,
    });

    return response;
  } catch (error) {
    console.error(
      `An error occurred during the initialization of the Chat Prompt: ${error.message}`
    );
    throw error; // rethrow the error to let the calling function know that an error occurred
  }
};

export default async function handler(req, res) {
  const { prompt, topic, firstMsg } = req.body;
  console.log(`Prompt: ${prompt} Topic: ${topic}`);

  if (
    chain === undefined &&
    !prompt.includes("https://www.youtube.com/watch?v=")
  ) {
    return res.status(400).json({
      error:
        "Chain not initialized. Please send a YouTube URL to initialize the chain.",
    });
  }

  chatHistory.push({
    role: "user",
    content: prompt,
  });

  // Just like in the previous section, if we have a firstMsg set to true, we need to initialize with chain with the context
  if (firstMsg) {
    console.log("Received URL");
    try {
      const videoId = extractVideoId(prompt);
      // API call for video transcript (same as last video, but we just grab the array and flatten it into a variable)[{text:" "},{ text: ""}]
      const transcriptResponse = await YoutubeTranscript.fetchTranscript(
        prompt
      );
      transcriptResponse.forEach((line) => {
        transcript += line.text;
      });
      // Some error handling
      if (!transcriptResponse) {
        return res.status(400).json({ error: "Failed to get transcript" });
      }

      // API call for video metadata –– go to VideoMetaData and explain this
      const metadata = await getVideoMetaData(videoId);

      // JSON object { [], [], [] } , null (no characters between), and use 2 spaces for indentation
      metadataString = JSON.stringify(metadata, null, 2);
      console.log({ metadataString });

      // ResearchAgent
      research = await ResearchAgent(topic);

      console.log({ research });

      // Alright, finally we have all the context and we can initialize the chain!
      const response = await initChain(
        transcript,
        metadataString,
        research,
        topic
      );

      // return res.status(200).json({ output: research });
      return res.status(200).json({
        output: response,
        chatHistory,
        transcript,
        metadata,
        research,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching transcript" });
    }
  } else {
    // Very similar to previous section, don't worry too much about this just copy and paste it from the previous section!
    console.log("Received question");
    try {
      const question = prompt;

      console.log("Asking:", question);
      console.log("Using old chain:", chain);
      // Everytime we call the chain we need to pass all the context back so that it can fill in the prompt template appropriately
      const response = await chain.call({
        transcript,
        metadata: metadataString,
        research,
        input: question,
      });

      // update chat history
      chatHistory.push({
        role: "assistant",
        content: response.text,
      });
      // just make sure to modify this response as necessary.
      return res.status(200).json({
        output: response,
        metadata: metadataString,
        transcript,
        chatHistory,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred during the conversation." });
    }
  }
}
