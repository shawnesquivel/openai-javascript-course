import { SerpAPI } from "langchain/tools";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

const SerpAPITool = () => {
  const serpAPI = new SerpAPI(process.env.SERPAPI_API_KEY, {
    baseUrl: "http://localhost:3000/agents",
    location: "Vancouver,British Columbia, Canada",
    hl: "en",
    gl: "us",
  });
  serpAPI.returnDirect = true;

  return serpAPI;
};

export default SerpAPITool;
