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

async function callModel(
  apiKey: string,
  baseURL: string,
  model: string,
  messages: any,
  jsonMode: boolean = false,
  retries: number = 3,
  backoffMs: number = 1000
) {
  const body: any = { model, messages };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(baseURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || "";
      if (jsonMode) {
        try {
          return JSON.parse(content);
        } catch (e) {
          console.error("Failed to parse AI JSON response:", e);
          return {
            status: "error",
            title: "Invalid AI Response",
            message: "The AI returned a response that was not valid JSON.",
            raw: content,
          };
        }
      }
      return content;
    }

    const errorText = await res.text();

    // If it's a 429, retry with exponential backoff
    if (res.status === 429 && attempt < retries) {
      const waitTime = backoffMs * Math.pow(2, attempt - 1);
      console.warn(
        `⚠️ [${model}] Rate limited (429). Retrying in ${waitTime}ms (attempt ${attempt}/${retries})`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      continue;
    }

    // Other errors or final retry failure → throw
    throw new Error(
      `API request failed with status ${res.status}: ${errorText}`
    );
  }

  throw new Error(
    `API request failed after ${retries} retries for model ${model}`
  );
}

const MODELS_PRIORITY = [
  { model: "x-ai/grok-4-fast:free" },
  { model: "deepseek/deepseek-chat-v3.1:free" },
  { model: "openai/gpt-5-nano" },
];

export async function safeCallModel(messages: any, jsonMode = false) {
  for (const { model } of MODELS_PRIORITY) {
    try {
      const res = await callModel(
        process.env.OPEN_ROUTER_API_KEY!,
        "https://openrouter.ai/api/v1/chat/completions",
        model,
        messages,
        jsonMode,
        3, // retries
        1000 // base backoff
      );
      return { model, content: res };
    } catch (err: any) {
      console.warn(`❌ ${model} failed:`, err.message);
      continue;
    }
  }

  throw new Error("All providers failed after retries.");
}
