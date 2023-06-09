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

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

// First, run this in your terminal:

// export OPENAI_API_KEY=sk-12345
// export SERPAPI_API_KEY=0ecaa8b9ecedb64f3c10e737cf5d6250b7b18c735d739631bbb0dac96b5b425b
// Replace sk-12345 with your OpenAI API Key

// https://platform.openai.com/account/api-keys

/**
 * 
 * Prompt Templates: Manage Prompts for LLMs
    

  When you make a call to ChatGPT, the LLM does not just see your response as it is.

  Basically your message is deconstructed and then fed into a template, so that the chatbot can better help you.

  They would take your message, then feed it into the user message.
  
  const messageTemplate = `You've been speaking with a user, and they just said: "${userMessage}". How would you respond?`;

  Langchain has already pre-defined some templates to make this SUPER easy!
 * 
 * 
 */

const template =
  "Please give me some ideas for content I should write about regarding {topic}? The content is for {socialplatform}. Translate to {language}.";
const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["topic", "socialplatform", "language"],
});

// This allows us to format the template into a string, which is finally passed to the LLM
// const formattedTemplate = await prompt.format({
//   topic: "artificial intelligence",
//   socialplatform: "twitter",
//   language: "spanish",
// });
// console.log(formattedTemplate);

/**
 *
 * To properly use the LLM, we generate chains.
 *
 * Chains are "chains" of complex tasks, linked together. Hence the name Lang Chain - it chains large language models tasks!
 *
 * The first "task" that we need to put together is putting together a Prompt and a Call to the OpenAI model
 *
 * This is the simplest task since it's only basically two steps.
 *
 *
 */

const model = new OpenAI({ temperature: 0.9 });
const chain = new LLMChain({ llm: model, prompt: prompt });

// Now that we've defined the chain, we can call the LLMChain, which does two steps:

// First it properly formats the prompt according to the user input variables

// Then it makes the call to Open AI's API!
// const resChain = await chain.call({
//   topic: "artificial intelligence",
//   socialplatform: "twitter",
//   language: "english",
// });

// console.log({ resChain });

/**
 *
 * The second big topic in Langchain is Agents.
 *
 * We'll cover this in detail in Module 5: AI Content Generator!
 *
 *
 * The biggest difference between a Chain and an Agent?
 *
 * A chain must be predefined (like configuring a robot)
 *
 * An agent is given a task and tools, then it figures out how to do the job.
 *
 *
 * E.g. if we want to do research on the internet, a chain will be set up like this:
 *
 * Chain: First, search the internet using the query. Then summarize it for me.
 *
 * Agent: First, we give it tools to search the internet. Then we ask it - "Who is Pedro Pascal?"
 *
 *  Then the agent will check its toolbox, figure out how it can get the job done, and do the steps in order.
 *
 * For example, let's ask on ChatGPT what langchain is.
 *
 *
 *
 */
// 0 = deterministic, 1 = creative
// https://platform.openai.com/docs/models/
// Gpt3.5turbo = fast, 1/10th cost of davinci
// davinci - default
const agentModel = new OpenAI({
  temperature: 0,
  modelName: "text-davinci-003",
});

// serpTool.returnDirect = true;

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
console.log("Loaded agent.");
const input = "What is Langchain?";

console.log(`Executing with input "${input}"...`);
// Awesome, so we can see it figured out that it needed to use a search engine.
// const result = await executor.call({ input });

// console.log(`Got output ${result.output}`);

/**
 *
 * Plan and Execute Agents
 *
 * Instead of the regular agents, which just try to evaluate their tools then do something, Plan and Execute Works a little diffrently.
 * 
 * 
 * This example shows how to use an agent that uses the Plan-and-Execute framework to answer a query. This framework works differently from the other currently supported agents (which are all classified as Action Agents) in that it uses a two step process:

  First, the agent uses an LLM to create a plan to answer the query with clear steps.

  Once it has a plan, it uses an embedded traditional Action Agent to solve each step.
  
  The idea is that the planning step keeps the LLM more "on track" by breaking up a larger task into simpler subtasks. However, this method requires more individual LLM queries and has higher latency compared to Action Agents.

 * 
 * 
 * 
 */

const agentTools = [new Calculator(), new SerpAPI()];
// only works with Chat models
const chatModel = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  verbose: true,
});
const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
  llm: chatModel,
  tools: agentTools,
});

const result = await executor.call({
  input: `Who is the current president of the United States? What is their current age raised to the second power?`,
});

console.log({ result });

// const llm = new OpenAI({});
// const memory = new BufferMemory();
// const conversationChain = new ConversationChain({ llm: llm, memory: memory });
// const res1 = await conversationChain.call({
//   input: "Hey. The president of the US is currently Lebron James.",
// });
// console.log(res1);

// const res2 = await conversationChain.call({
//   input: "Who is hte president of the US?",
// });
// console.log(res2);
