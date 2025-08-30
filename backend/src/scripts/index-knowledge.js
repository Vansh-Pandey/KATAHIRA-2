import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";

// --- Setup __dirname for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Explicitly load .env from backend/ ---
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });
console.log("Loaded .env from:", envPath);

// --- Verify environment variables ---
console.log("GEMINI_API_KEY (first 5):", process.env.GEMINI_API_KEY?.slice(0, 5) || "MISSING");
console.log("PINECONE_KEY (first 5):", process.env.PINECONE_KEY?.slice(0, 5) || "MISSING");

// --- Build absolute path to the data file ---
const filePath = path.join(__dirname, "data", "try-n5.txt");
console.log("Looking for file:", filePath);

// --- Load your text file ---
const japaneseText = fs.readFileSync(filePath, "utf-8");
console.log("File loaded successfully, size:", japaneseText.length, "chars");
const chunkSize = 500;
const chunks = [];
for (let i = 0; i < japaneseText.length; i += chunkSize) {
  chunks.push(japaneseText.slice(i, i + chunkSize));
}
console.log(`Prepared ${chunks.length} document chunks.`);
// --- Split text into chunks and wrap as LangChain documents ---
const docs = chunks.map((chunk, i) =>
  new Document({
    pageContent: chunk.trim(),
    metadata: { id: i }  // keep metadata tiny!
  })
); 
console.log("Initializing Gemini embeddings...");
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001"
});
console.log("Gemini embeddings ready.");

console.log("Connecting to Pinecone...");
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_KEY 
});

console.log("Selecting index: japanese-tutor");
const index = pinecone.index("japanese-tutor");
const batchSize = 50;
console.log("Uploading documents to Pinecone in batches of", batchSize);
for (let i = 0; i < docs.length; i += batchSize) {
  const batch = docs.slice(i, i + batchSize);
  console.log(`Upserting batch ${i / batchSize + 1} of ${Math.ceil(docs.length / batchSize)}`);
  await PineconeStore.fromDocuments(batch, embeddings, { pineconeIndex: index });
}

console.log("All document chunks indexed successfully!");
