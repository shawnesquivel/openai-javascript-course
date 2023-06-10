import { OpenAI } from "langchain/llms/openai";
import SSE from "express-sse";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

const sse = new SSE();

export default function handler(req, res) {
  if (req.method === "POST") {
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }
    // Initialize model
    const chat = new OpenAI({
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
            sse.send(token, "newToken");
          },
        },
      ],
    });

    // create the prompt
    const prompt = `Create me a short rap about my name and city. Make it funny and punny. Name: ${input}`;

    console.log({ prompt });
    // call frontend to backend
    chat.call(prompt).then(() => {
      sse.send(null, "end");
    });

    return res.status(200).json({ result: "Streaming complete" });
  } else if (req.method === "GET") {
    sse.init(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
