import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  mongoose.set("bufferCommands", false);

  const uri = process.env.MONGO_URI;
  if (!uri && (process.env.VERCEL || process.env.NODE_ENV === "production")) {
    console.warn("[db] Serverless/Production environment without MONGO_URI. Operating with in-memory fallback auth/services.");
    return;
  }

  const targetUri = uri || "mongodb://localhost:27017/epc_ai_platform";
  try {
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 3000 });
    isConnected = true;
    console.log(`[db] connected -> ${targetUri.replace(/:[^:@]+@/, ":***@")}`);
  } catch (err) {
    console.error(`\n❌ [db] Connection to MongoDB failed: ${err.message}`);

    // On Vercel / serverless environment, skip downloading mongodb-memory-server
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.error("[db] Serverless/Production environment detected. Skipping in-memory server creation.");
      return;
    }

    console.log("[db] Attempting fallback to in-memory MongoDB...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log(`[db] Connected to fallback in-memory DB: ${mongoUri}`);

      console.log("[db] Auto-seeding in-memory database with demo accounts...");
      const { seedData } = await import("../data/seed.js");
      await seedData(false);
      console.log("[db] In-memory database ready!");
    } catch (fallbackErr) {
      console.error("[db] Could not initialize fallback DB:", fallbackErr.message);
    }
  }
};
