import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

let vectorstore;

export async function initVectorStore() {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "embedding-001",
    });

    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_KEY });
    const index = pinecone.index("japanese-tutor");

    vectorstore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });
    console.log("✅ Vector store initialized with Gemini embeddings.");
  } catch (err) {
    console.error("❌ Failed to initialize vector store:", err);
    throw err; // Re-throw so your server knows initialization failed
  }
}

export async function retrieveContext(query) {
  if (!vectorstore) throw new Error("Vector store not initialized");
  
  const results = await vectorstore.similaritySearch(query, 3);
  return results.map(r => r.pageContent).join("\n\n"); 
}
