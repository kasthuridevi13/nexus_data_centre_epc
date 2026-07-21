import { askClaude, askClaudeForJSON } from "./claudeClient.js";
import { askGroq, askGroqForJSON } from "./groqClient.js";

/**
 * Routes LLM requests to either Groq or Anthropic based on environment variables.
 */
export async function askLLM(args) {
  const provider = process.env.AI_PROVIDER || "anthropic";
  
  if (provider.toLowerCase() === "groq") {
    return await askGroq(args);
  } else {
    return await askClaude(args);
  }
}

/**
 * Routes JSON LLM requests to either Groq or Anthropic.
 */
export async function askLLMForJSON(args) {
  const provider = process.env.AI_PROVIDER || "anthropic";
  
  if (provider.toLowerCase() === "groq") {
    return await askGroqForJSON(args);
  } else {
    return await askClaudeForJSON(args);
  }
}
