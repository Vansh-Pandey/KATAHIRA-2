import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/ai'; // or your server URL

export const useAiStore = create((set, get) => ({
  messages: [],
  userId: null,

  setUserId: (id) => set({ userId: id }),

  addMessage: async (message) => {
    const { userId } = get();
    if (!userId) throw new Error("No userId in store");

    try {
      await axios.post(`${API_URL}/message`, { userId, message });
      set((state) => ({ messages: [...state.messages, message] }));
    } catch (err) {
      console.error("Error saving message:", err);
    }
  },

  loadHistory: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      const res = await axios.get(`${API_URL}/history/${userId}`);
      set({ messages: res.data.messages });
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  },

  clearHistory: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      await axios.delete(`${API_URL}/clear/${userId}`);
      set({ messages: [] });
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  }
}));
