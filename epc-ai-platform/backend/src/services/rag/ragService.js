import Document from "../../models/Document.js";
import DocumentChunk from "../../models/DocumentChunk.js";
import { chunkText } from "../../utils/textChunker.js";
import { buildTermVector, cosineSimilarity } from "../../utils/similarity.js";

/**
 * Ingests a document: chunks the text, builds a term vector per chunk, stores it.
 * This is the ONE ingestion path shared by every agent - the architectural point
 * of this build (see README "Why one RAG layer").
 */
export async function ingestDocument(documentId) {
  const doc = await Document.findById(documentId);
  if (!doc) throw new Error("Document not found");

  doc.status = "processing";
  await doc.save();

  const rawChunks = chunkText(doc.rawText);
  await DocumentChunk.deleteMany({ document: doc._id }); // re-index safe

  const chunkDocs = rawChunks.map((c) => ({
    document: doc._id,
    chunkIndex: c.chunkIndex,
    text: c.text,
    clauseRef: c.clauseRef,
    vector: buildTermVector(c.text),
  }));

  if (chunkDocs.length) await DocumentChunk.insertMany(chunkDocs);

  doc.status = "indexed";
  await doc.save();

  return { documentId: doc._id, chunksIndexed: chunkDocs.length };
}

/**
 * Retrieves the top-k most relevant chunks for a query, optionally scoped to a
 * document type (e.g. only search "specification" docs) or a specific document.
 */
export async function retrieveRelevantChunks({ query, topK = 6, documentType, documentId, system }) {
  const queryVector = buildTermVector(query);

  const docFilter = {};
  if (documentType) docFilter.type = documentType;
  if (system) docFilter.system = system;

  let candidateDocIds = null;
  if (documentId) {
    candidateDocIds = [documentId];
  } else if (Object.keys(docFilter).length) {
    const docs = await Document.find(docFilter).select("_id");
    candidateDocIds = docs.map((d) => d._id);
  }

  const chunkFilter = candidateDocIds ? { document: { $in: candidateDocIds } } : {};
  const chunks = await DocumentChunk.find(chunkFilter).populate("document", "title type system vendor").lean();

  const scored = chunks
    .map((c) => ({ ...c, score: cosineSimilarity(queryVector, c.vector) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

export function formatChunksForPrompt(chunks) {
  return chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}] Document: "${c.document?.title}" (${c.document?.type}${
          c.clauseRef ? `, ${c.clauseRef}` : ""
        })\n${c.text}`
    )
    .join("\n\n---\n\n");
}
