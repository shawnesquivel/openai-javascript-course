import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { ZeroShotAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { AgentExecutor } from "langchain/agents";
import SerpAPITool from "../tools/SerpAPI";
import WebBrowserTool from "../tools/WebBrowser";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */
const ResearchAgent = async (topic) => {
  console.log({ topic });
  try {
    // We'll give it tohe ability to search Google and also Browse the WEb
    // show the importance of returnDirect
    const SerpAPI = SerpAPITool();
    const WebBrowser = WebBrowserTool();

    console.log(SerpAPI.returnDirect);
    console.log(WebBrowser.returnDirect);
    // We put them into an array of tools
    const tools = [SerpAPI, WebBrowser];

    // We'll use the ZeroShotReactDescription which is the recommended tool for chat models
    // https://js.langchain.com/docs/modules/agents/agents/
    // The cool thing is that Langchain gives us a method that can create prompts specifically for that agent
    const promptTemplate = ZeroShotAgent.createPrompt(tools, {
      prefix: `Answer the following questions as best you can. You have access to the following tools:`,
      suffix: `Begin! Answer concisely. It's OK to say you don't know.`,
    });

    // Then we'll initialize it with a Prompt template again
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      new SystemMessagePromptTemplate(promptTemplate),
      HumanMessagePromptTemplate.fromTemplate(`{input}`),
    ]);

    // And we'll initialize the model, what is chatOpenAI since we're using a ChatAgent
    const chat = new ChatOpenAI({});
    // We'll create an LLM chain which just a prompt  template and a LLM or chat model
    const llmChain = new LLMChain({
      prompt: chatPrompt,
      llm: chat,
    });
    // then we'lll use that LLM chain as the basis of the agent
    // so basidcally our agent is made up of: Tools, LLM and Prompt Templates, making it highly customizable to our needs!
    const agent = new ZeroShotAgent({
      llmChain,
      allowedTools: tools.map((tool) => tool.name),
    });
    // Now we'll create an Executor instance which allows us to make queries to the agent

    const executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      returnIntermediateSteps: false,
      // Max iterations is important - because sometimes our agent can get confused. this can be from a variety of factors such as:
      // not using the right agent for the tool
      // prompts are not perfect – check out the document for crafting the perfect prompt!
      // always set this to a low number to start, or if you're not going to watch the output
      maxIterations: 3,
      // Always set verbose to true, there was a case where I didn't do this and realized my agent was going in loops
      verbose: true,
    });

    const result = await executor.run(`Who is ${topic}?`);

    return result;
  } catch (err) {
    console.error(err);
    return "Error in completing research";
  }
};
export default ResearchAgent;
