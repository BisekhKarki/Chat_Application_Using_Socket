import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch list of users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");

      // Ensure users is always an array
      set({ users: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch users.";
      toast.error(errorMessage);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages for a selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      if (!userId) throw new Error("User ID is required to fetch messages.");

      const res = await axiosInstance.get(`/messages/${userId}`);

      // Ensure messages is always an array
      set({ messages: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch messages.";
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message to the selected user
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      if (!selectedUser || !selectedUser._id) {
        throw new Error("No user selected for sending the message.");
      }

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // Update the messages state
      set({ messages: [...messages, res.data] });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send the message.";
      toast.error(errorMessage);
    }
  },

  // Set the selected user
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });

    // Optionally, fetch messages for the newly selected user
    if (selectedUser?._id) {
      get().getMessages(selectedUser._id);
    }
  },
}));
