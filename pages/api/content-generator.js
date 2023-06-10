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
// /pages/api/transcript_chat.js

// Global Variables
let chain;
let chatHistory = [];
let transcript = "";
let metadataString = "";
let research;

const initChain = async (transcript, metadataString, research, topic) => {
  try {
    const llm = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-3.5-turbo",
    });

    console.log(`Initializing Chat Prompt`);

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
    });
    let response;

    try {
      response = await chain.call({
        transcript,
        metadata: metadataString,
        research,
        input: question,
      });
    } catch (error) {
      console.error(
        `An error occurred during the call to chain: ${error.message}`
      );
      response = { text: "" }; // Provide an empty response or a default value
    }

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
    throw new Error(`initChain error: ${error.message}`);
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

  if (firstMsg) {
    console.log("Received URL");
    try {
      const videoId = extractVideoId(prompt);

      const transcriptResponse = await YoutubeTranscript.fetchTranscript(
        prompt
      );
      if (!transcriptResponse) {
        throw new Error("Failed to get transcript");
      }

      transcriptResponse.forEach((line) => {
        transcript += line.text;
      });

      const metadata = await getVideoMetaData(videoId);
      metadataString = JSON.stringify(metadata, null, 2);
      console.log({ metadataString });

      research = await ResearchAgent(topic);
      console.log({ research });

      const response = await initChain(
        transcript,
        metadataString,
        research,
        topic
      );

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
        .json({ error: `Error fetching transcript: ${err.message}` });
    }
  } else {
    console.log("Received question");
    try {
      const question = prompt;
      console.log("Asking:", question);
      console.log("Using old chain:", chain);

      const response = await chain.call({
        transcript,
        metadata: metadataString,
        research,
        input: question,
      });

      chatHistory.push({
        role: "assistant",
        content: response.text,
      });

      return res.status(200).json({
        output: response,
        metadata: metadataString,
        transcript,
        chatHistory,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: `Error during conversation: ${error.message}` });
    }
  }
}
