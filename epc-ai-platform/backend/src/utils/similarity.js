// Lightweight, dependency-free retrieval layer.
// A real deployment would swap this for OpenAI/Voyage embeddings + a vector DB
// (see README "Productionizing" section) - this keeps the hackathon build runnable
// with zero external embedding API keys while still doing real semantic-ish matching
// via TF weighting + stopword filtering + n-gram overlap.

const STOPWORDS = new Set([
  "the","a","an","of","to","in","and","or","is","are","be","by","for","on","with",
  "as","at","this","that","shall","will","from","which","it","its","or","not",
  "all","any","each","per","into","such","other","between","within",
]);

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function buildTermVector(text) {
  const tokens = tokenize(text);
  const freq = {};
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
  const total = tokens.length || 1;
  const vector = {};
  for (const [term, count] of Object.entries(freq)) {
    vector[term] = count / total; // simple term-frequency weight
  }
  return vector;
}

export function cosineSimilarity(vecA, vecB) {
  const a = vecA instanceof Map ? Object.fromEntries(vecA) : vecA;
  const b = vecB instanceof Map ? Object.fromEntries(vecB) : vecB;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (const key of Object.keys(a)) {
    magA += a[key] * a[key];
    if (b[key]) dot += a[key] * b[key];
  }
  for (const key of Object.keys(b)) {
    magB += b[key] * b[key];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
