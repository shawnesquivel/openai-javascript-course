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
  env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY },
  // To fix Reference Error from content-generator: https://github.com/vercel/next.js/issues/40399
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
  },
};

module.exports = nextConfig;
