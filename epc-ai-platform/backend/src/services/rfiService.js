import RFI from "../models/RFI.js";
import { retrieveRelevantChunks, formatChunksForPrompt } from "./rag/ragService.js";
import { askLLM } from "./aiClient.js";
import { buildTermVector, cosineSimilarity } from "../utils/similarity.js";
import { logAgentAction } from "./auditService.js";

const SYSTEM_PROMPT = `You are the Project Knowledge & RFI Intelligence Copilot for a hyperscale
data centre EPC project. Answer the question using ONLY the retrieved project documents
provided as context. Cite sources inline like [Source 1], [Source 2]. If the context does
not contain the answer, say so plainly rather than guessing. Keep answers precise and
contractual in tone - this may be used as a record.`;

export async function askProjectQuestion(question) {
  const chunks = await retrieveRelevantChunks({ query: question, topK: 6 });
  const context = formatChunksForPrompt(chunks);

  const prompt = `PROJECT CONTEXT:\n${context || "(no relevant documents found)"}\n\nQUESTION: ${question}`;
  const answer = await askLLM({ system: SYSTEM_PROMPT, prompt, maxTokens: 900 });

  // Dedup / reuse: find similar past RFIs by comparing term vectors of the question text.
  const pastRFIs = await RFI.find({ status: { $ne: "open" } }).select("question answer").lean();
  const qVec = buildTermVector(question);
  const similar = pastRFIs
    .map((r) => ({ ...r, score: cosineSimilarity(qVec, buildTermVector(r.question)) }))
    .filter((r) => r.score > 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const rfi = await RFI.create({
    question,
    answer,
    citedChunks: chunks.map((c) => ({
      document: c.document?._id,
      chunkIndex: c.chunkIndex,
      excerpt: c.text.slice(0, 240),
    })),
    status: "answered",
    similarPastRFIs: similar.map((s) => s._id),
    raisedBy: "Field Engineer",
  });

  await logAgentAction({
    agent: "rfi_intelligence_agent",
    action: "answered_query",
    entityType: "RFI",
    entityId: rfi._id,
    evidence: chunks.map((c) => c.document?.title).filter(Boolean),
    reasoning: `Answered from ${chunks.length} retrieved chunks; ${similar.length} similar past RFIs found.`,
    outcome: "answered",
  });

  return { rfi, similarPastRFIs: similar };
}

export async function listRFIs() {
  return RFI.find().populate("citedChunks.document", "title type").sort({ createdAt: -1 });
}
