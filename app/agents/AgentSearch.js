import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import Cors from "cors";
// https://blog.sentry.io/common-errors-in-next-js-and-how-to-resolve-them/#cors-error-next-api-routes
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Langchain 0.052

const AgentSearch = async (req, res, prompt) => {
  await runMiddleware(req, res, cors);

  // First, I always like to set up with my LLM, just to test that the environment is working properly.
  const llm = new OpenAI({
    openAIApiKey: process.env["OPENAI_API_KEY"],
    temperature: 0,
  });

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      baseUrl: "http://localhost:3000/agents",
      location: "Vancouver,British Columbia, Canada",
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];

  const agent = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description",
  });

  console.log("Loaded agent.");

  const input =
    "How much is Sam Altman net worth?" +
    " How many years working minimum wage in British Columbia to acquire that much wealth?";

  console.log(`Executing with input "${input}"...`);

  const result = agent.call({ input: input });

  return result;
};

export default AgentSearch;
