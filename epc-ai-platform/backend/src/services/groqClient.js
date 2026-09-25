import Groq from "groq-sdk";

let client = null;

function getClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set. Add it to backend/.env");
  }
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return client;
}

/**
 * Single shared entrypoint for Groq's LLM call, mimicking Claude's interface.
 */
export async function askGroq({ system, prompt, maxTokens = 1200 }) {
  const groq = getClient();
  let model = process.env.GROQ_MODEL || "llama3-70b-8192";

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    model: model,
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content || "";
}

/** Asks Groq for strict JSON and parses it, stripping any markdown fences. */
export async function askGroqForJSON(args) {
  const raw = await askGroq(args);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Groq did not return valid JSON: ${err.message}\nRaw: ${raw.slice(0, 300)}`);
  }
}
