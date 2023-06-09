// Solution
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

let model;
let memory;
let chain;
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { input, firstMsg } = req.body;

    if (!input) {
      throw new Error("No input!");
    }

    if (firstMsg) {
      console.log("initializing chain");
      model = new OpenAI({ modelName: "gpt-3.5-turbo" });
      memory = new BufferMemory();
      chain = new ConversationChain({ llm: model, memory: memory });
    }

    console.log({ input });
    const response = await chain.call({ input });
    console.log({ response });
    return res.status(200).json({ output: response });
  } else {
    res.status(405).json({ message: "Only POST is allowed" });
  }
}
