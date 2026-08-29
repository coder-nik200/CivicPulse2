import { MongoClient } from "mongodb";

let client;
export let db;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  client = new MongoClient(uri);

  await client.connect();

  db = client.db("civicpulse");

  await db.command({ ping: 1 });

  console.log("✓ MongoDB connected successfully");
}