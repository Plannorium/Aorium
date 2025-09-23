// import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY!;
const SITE_URL = "https://aorium.app";
const SITE_NAME = "Aorium";

const baseHeaders = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  "HTTP-Referer": SITE_URL,
  "X-Title": SITE_NAME,
  "Content-Type": "application/json",
};

// Generic handler
export async function analyzeData(task: string, context: any) {
    let model = "deepseek-chat"; // default model
    let messages = [];
  
    if (task === "file-analysis") {
      // construct messages for file analysis
      messages = [
        {
          role: "user",
          content: `${context.prompt}\n\nFile Content:\n${context.content}`,
        },
      ];
    } else {
      // other tasks
      messages = [
          {
              role: "user",
              content: context.prompt,
          }
      ]
    }
  
    return await callModel(model, messages);
  }
