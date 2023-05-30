import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { exec } from "child_process";

// export OPENAI_API_KEY=<>
// export SERPAPI_API_KEY=<>
// Replace with your API keys!

// 1. Prompt Templates

// google: 'who is elon musk'
// chatgpt: 'who is elon musk' => prompt template => 'You are a helpful assistant, speaking with a user. They just said {who is Elon Musk}. Be as helpful as possible! And nice!

const template =
  "You are a director of social media with 30 years of experience. Please give me some ideas for content I should write about regarding {topic}? The content is for {socialplatform}. Translate to {language}.";

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["topic", "socialplatform", "language"],
});

// const formattedPromptTemplate = await prompt.format({
//   topic: "artificial intelligience",
//   socialplatform: "twitter",
//   language: "spanish",
// });

// console.log({ formattedPromptTemplate });

// LLM Chain - 1. Creates Prompt Template (format) 2. Call to OpenAI
// 0=not creative, 1=very creative
const model = new OpenAI({ temperature: 0.9 });

const chain = new LLMChain({ prompt: prompt, llm: model });

// const resChain = await chain.call({
//   topic: "artificial intelligience",
//   socialplatform: "twitter",
//   language: "english",
// });

// console.log({ resChain });

// Chain = pre-defined --- 1. research => API call. 2. summarize research
// Agent = task + tools +template => it figures out what to do
// https://platform.openai.com/docs/models/
const agentModel = new OpenAI({
  temperature: 0,
  modelName: "text-davinci-003",
});

const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Dallas,Texas,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];

// const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
//   agentType: "zero-shot-react-description",
//   verbose: true,
//   maxIterations: 5,
// });

// const input = "What is langchain?";

// const result = await executor.call({ input });

// console.log({ result });

/**
 *
 * Plan and Action Agent
 *
 */

const chatModel = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  verbose: true,
});

const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
  llm: chatModel,
  tools: tools,
});

// We don't tell it HOW to do it. We just tell it what to do.
// const result = await executor.call({
//   input:
//     "Who is the current president of the United States? What is their current age raised to the second power?",
// });

// console.log({ result });

// MEMORY
const llm = new OpenAI({});
const memory = new BufferMemory();
const conversationChain = new ConversationChain({ llm: llm, memory: memory });

const res1 = await conversationChain.call({
  input: "Hey, my name is Shawn!",
});

console.log(res1);

const input2 = "What's my name?";
const res2 = await conversationChain.call({
  input: input2,
});

console.log(input2);
console.log(res2);
