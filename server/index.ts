import express from "express";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME ?? "mydb";
const PORT = Number(process.env.PORT) || 3000;

async function main() {
  const client = new MongoClient(MONGO_URI);

  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`Connected to MongoDB — db: ${DB_NAME}`);

  const app = express();

  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  process.on("SIGINT", async () => {
    await client.close();
    process.exit(0);
  });
}

main().catch(console.error);
