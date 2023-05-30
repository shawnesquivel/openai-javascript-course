import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const WebBrowserTool = () => {
  const model = new ChatOpenAI({ temperature: 0 });
  const embeddings = new OpenAIEmbeddings({});

  const browser = new WebBrowser({ model, embeddings });
  browser.returnDirect = true;

  return browser;
};

export default WebBrowserTool;
