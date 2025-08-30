import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";
export const useAiStore = create((set, get) => ({
  userId: null,
  messages: [], 

  setUserId: (id) => set({ userId: id }),

  addMessage: async (message) => {
    const { userId } = get();
    if (!userId) throw new Error("No userId in store");

    try {
      // Add user message to local state immediately for better UX
      set((state) => ({ messages: [...state.messages, message] }));
      
      // Send to backend and get tutor response
      const response = await axios.post(`${API_URL}/ai/message`, { 
        userId, 
        message 
      });
      
      // Add tutor response to messages
      if (response.data.reply) {
        const tutorMessage = {
          id: Date.now(),
          type: 'tutor',
          content: response.data.reply,
          timestamp: new Date()
        };
        set((state) => ({ messages: [...state.messages, tutorMessage] }));
      }
    } catch (err) {
      console.error("Error saving message:", err);
      // Optionally add an error message to the chat
      const errorMessage = {
        id: Date.now(),
        type: 'tutor',
        content: "申し訳ありません (Sumimasen) - I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };
      set((state) => ({ messages: [...state.messages, errorMessage] }));
    }
  },

  loadHistory: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      const res = await axios.get(`${API_URL}/ai/history/${userId}`);
      set({ messages: res.data.messages || [] });
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  },

  clearHistory: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      await axios.delete(`${API_URL}/ai/clear/${userId}`);
      set({ messages: [] });
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  }
}));