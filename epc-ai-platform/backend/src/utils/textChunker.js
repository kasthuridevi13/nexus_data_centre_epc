// Splits raw document text into overlapping chunks suitable for retrieval.
// Also does a best-effort clause reference extraction (e.g. "Section 26.05.3.2")
// so compliance findings and RFI answers can cite a real clause, not just a page number.

const CLAUSE_REGEX = /(Section|Clause|Article|Para(?:graph)?)\s+[0-9]+(\.[0-9]+)*\.?/gi;

export function chunkText(text, { chunkSize = 900, overlap = 150 } = {}) {
  const clean = (text || "").replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const chunks = [];
  let start = 0;
  let idx = 0;

  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);
    const slice = clean.slice(start, end);
    const clauseMatch = slice.match(CLAUSE_REGEX);
    chunks.push({
      chunkIndex: idx,
      text: slice.trim(),
      clauseRef: clauseMatch ? clauseMatch[0] : null,
    });
    idx += 1;
    if (end === clean.length) break;
    start = end - overlap;
  }
  return chunks;
}
