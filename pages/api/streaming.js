import { OpenAI } from "langchain/llms/openai";
import SSE from "express-sse";

const sse = new SSE();

export default function handler(req, res) {
  if (req.method === "POST") {
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }
    // Initialize model

    // create the prompt

    // call frontend to backend

    return res.status(200).json({ result: "OK" });
  } else if (req.method === "GET") {
    sse.init(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
