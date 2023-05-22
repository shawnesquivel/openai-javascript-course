import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";

// create instance of chatOpenAI

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Grab the user prompt

    // Enter your code here

    // Modify output as needed
    return res.status(200).json({ result: response });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
