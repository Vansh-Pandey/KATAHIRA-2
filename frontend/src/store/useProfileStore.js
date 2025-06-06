import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import { toast } from "react-toastify";

export const useProfileStore = create((set) => ({
  profile: null,
  isFetchingProfile: false,
  isUpdatingProfile: false,
  error: null, // Added error state

  fetchProfile: async () => {
    set({ isFetchingProfile: true, error: null });
    try {
      const res = await axiosInstance.get("/profile");
      set({ profile: res.data });
    } catch (error) {
      console.error("Error fetching profile:", error);
      set({ error: error.response?.data?.error || "Failed to fetch profile" });
      toast.error(error.response?.data?.error || "Failed to fetch profile");
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  updateProfile: async (updatedData) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const res = await axiosInstance.patch("/profile/update", updatedData);
      set({ profile: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ error: error.response?.data?.error || "Failed to update profile" });
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Reset profile state
  resetProfile: () => set({ profile: null, error: null }),
}));