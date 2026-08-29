import { MongoClient } from "mongodb";
import mongoose from "mongoose";

let client;
export let db;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  // Connect Mongoose
  await mongoose.connect(uri, { dbName: "civicpulse" });

  client = new MongoClient(uri);

  await client.connect();

  db = client.db("civicpulse");

  await db.command({ ping: 1 });

  console.log("✓ MongoDB and Mongoose connected successfully");
}