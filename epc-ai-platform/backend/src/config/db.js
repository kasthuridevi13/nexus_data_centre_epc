import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/epc_ai_platform";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log(`[db] connected -> ${uri.replace(/:[^:@]+@/, ":***@")}`);
  } catch (err) {
    console.error(`\n❌ [db] Connection to MongoDB failed: ${err.message}`);
    console.error(`👉 TIP: If using MongoDB Atlas, your current IP address is likely not whitelisted.`);
    console.error(`👉 Go to https://cloud.mongodb.com -> Security -> Network Access -> Add IP Address (or 0.0.0.0/0 for dev).\n`);

    console.log("[db] Attempting fallback to in-memory MongoDB...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`[db] Connected to fallback in-memory DB: ${mongoUri}`);

      console.log("[db] Auto-seeding in-memory database with demo accounts...");
      const { seedData } = await import("../data/seed.js");
      await seedData(false);
      console.log("[db] In-memory database ready!");
    } catch (fallbackErr) {
      console.error("[db] Could not initialize fallback DB:", fallbackErr.message);
      process.exit(1);
    }
  }
};


