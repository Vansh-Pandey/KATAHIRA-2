import AiChat from "../models/ai.model.js";
import { retrieveContext } from "../lib/rag.js"; // <-- only if actually in lib/rag.js
import { generateGeminiResponse } from "../lib/gemini.js";

// helper to fetch last N messages
async function getRecentMessages(userId, limit = 5) {
  const chat = await AiChat.findOne({ userId });
  if (!chat) return [];
  return chat.messages.slice(-limit);
}

export const saveMessage = async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message?.content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // --- Step 1: Save student message ---
    let chat = await AiChat.findOne({ userId });
    const studentMessage = {
      type: "student",
      content: message.content,
      translation: message.translation || "",
      timestamp: new Date()
    };

    if (!chat) {
      chat = new AiChat({ userId, messages: [studentMessage] });
    } else {
      chat.messages.push(studentMessage);
    }
    await chat.save();

    // --- Step 2: Retrieve RAG context ---
    let context = "";
    try {
      context = await retrieveContext(message.content);
    } catch (err) {
      console.error("❌ Error retrieving context:", err);
    }

    // --- Step 3: Get conversation history if exists ---
    let history = [];
    if (chat.messages.length > 1) {
      history = chat.messages
        .slice(0, -1) // all messages except the last one (just added)
        .map(m => `${m.type}: ${m.content}`)
        .join("\n");
    }

    // --- Step 4: Build LLM prompt ---
    let prompt = `You are Tanaka-sensei, a friendly Japanese tutor.
Your task is to help the student understand Japanese.
Always explain everything clearly and simply **in English**, even if the example or context contains Japanese. If you use Japanese, you must provide the **English translation** immediately after.

Use the following context from teaching materials:
${context || "(no additional context available)"}
`;


    if (history) {
      prompt += `Previous conversation:\n${history}\n\n`;
    }

    prompt += `Student just asked: "${message.content}"
Give a helpful, simple explanation.`;

    console.log("📝 Prompt sent to Gemini:\n", prompt);

    // --- Step 5: Get tutor response ---
    let tutorReply = "";
    try {
      tutorReply = await generateGeminiResponse(prompt);
      console.log("✅ Gemini reply:", tutorReply);
    } catch (err) {
      console.error("❌ Gemini API error:", err);
      tutorReply = "Sorry, I ran into an issue generating a response.";
    }

    // --- Step 6: Save tutor message ---
    const tutorMessage = {
      type: "tutor",
      content: tutorReply,
      timestamp: new Date()
    };
    chat.messages.push(tutorMessage);
    await chat.save();

    res.status(200).json({ success: true, reply: tutorReply, chat });
  } catch (err) {
    console.error("💥 Server error:", err);
    res.status(500).json({ error: "Server error while processing message" });
  }
};


export const getChatHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const chat = await AiChat.findOne({ userId });
    if (!chat) return res.status(404).json({ error: "No history found" });
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching history" });
  }
};

export const clearHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const deleted = await AiChat.deleteOne({ userId });
    res.status(200).json({ success: true, deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not clear history" });
  }
};
