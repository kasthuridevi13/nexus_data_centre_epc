import Anthropic from "@anthropic-ai/sdk";

let client = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to backend/.env");
  }
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

/**
 * Single shared entrypoint for every agent's LLM call, so prompts, model choice,
 * and error handling live in one place.
 */
export async function askClaude({ system, prompt, maxTokens = 1200 }) {
  const anthropic = getClient();
  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}

/** Asks Claude for strict JSON and parses it, stripping any markdown fences. */
export async function askClaudeForJSON(args) {
  const raw = await askClaude(args);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Claude did not return valid JSON: ${err.message}\nRaw: ${raw.slice(0, 300)}`);
  }
}
