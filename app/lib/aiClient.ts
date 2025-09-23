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
async function callModel(
  model: string,
  messages: any,
  jsonMode: boolean = false
) {
  const body: any = { model, messages };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      "AI API request failed:",
      res.status,
      res.statusText,
      errorText
    );
    throw new Error(
      `API request failed with status ${res.status}: ${errorText}`
    );
  }

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
