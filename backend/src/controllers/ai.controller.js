import AiChat from "../models/ai.model.js";

// Save message (append to existing or create new)
export const saveMessage = async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) return res.status(400).json({ error: "Missing fields" });

  try {
    let chat = await AiChat.findOne({ userId });

    if (!chat) {
      chat = new AiChat({ userId, messages: [message] });
    } else {
      chat.messages.push(message);
    }

    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while saving message" });
  }
};

// Get chat history for a user
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

// Optionally clear history
export const clearHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await AiChat.deleteOne({ userId });
    res.status(200).json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: "Could not clear history" });
  }
};
