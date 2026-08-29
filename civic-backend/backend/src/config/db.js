import { MongoClient } from "mongodb";

let client;

export let db;

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    client = new MongoClient(uri);

    await client.connect();

    db = client.db(process.env.MONGODB_DB_NAME || "CivicFix");

    await db.command({
      ping: 1,
    });

    console.log(`✅ MongoDB connected successfully: ${db.databaseName}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);

    process.exit(1);
  }
}
