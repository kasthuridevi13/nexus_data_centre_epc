import mongoose from "mongoose";

// Chunk-level storage with a lightweight TF-IDF style vector for retrieval.
// This is what powers the Compliance Agent AND the RFI Copilot off the SAME index -
// that shared retrieval layer is the core architectural differentiator of this build.
const documentChunkSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    clauseRef: { type: String }, // e.g. "Section 26.05 - Clause 3.2" if detectable
    vector: {
      // sparse term-weight map, built by ragService - avoids needing an external embeddings API
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

documentChunkSchema.index({ document: 1, chunkIndex: 1 });

export default mongoose.model("DocumentChunk", documentChunkSchema);
