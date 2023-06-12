/** @type {import('next').NextConfig} */
// https://js.langchain.com/docs/getting-started/install#vercel--nextjs
// To use LangChain with Next.js (either with app/ or pages/), add the following to your next.config.js to enable support for WebAssembly modules (which is required by the tokenizer library @dqbd/tiktoken):
const nextConfig = {
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_ENV: process.env.PINECONE_ENV,
    PINECONE_INDEX: process.env.PINECONE_INDEX,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PRIVATE_KEY: process.env.SUPABASE_PRIVATE_KEY,
  },
  // To fix Reference Error from content-generator: https://github.com/vercel/next.js/issues/40399
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
  },
};

module.exports = nextConfig;
