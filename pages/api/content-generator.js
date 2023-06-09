// /pages/api/transcript_chat.js
import { YoutubeTranscript } from "youtube-transcript";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import extractVideoId from "../../utils/extractVideoId";
import getVideoMetaData from "../../utils/getVideoMetaData";
import ResearchAgent from "../../agents/ResearchAgent";

// Global Variables

// Initialize Chain with Data
const initChain = async (transcript, metadataString, research, topic) => {
  try {
    // do stuff

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
      // Initialize chain with transcript, metadata, research, and topic

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
      // do stuff

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
