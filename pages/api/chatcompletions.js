import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

const chat = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Grab the user prompt
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }

    // Enter your code here
    const response = await chat.call([
      new HumanChatMessage(`How do I write a for loop in ${input}?`),
    ]);

    console.log(response);

    // Modify output as needed
    return res.status(200).json({ result: response });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
