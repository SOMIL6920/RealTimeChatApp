import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./UseAuthStore.js";
import { getErrorMessage } from "../lib/errorMessage";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isTyping: false,  // ⌨️ NEW: typing indicator state

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load users"));
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load messages"));
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to send message"));
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });

        // ⌨️ TYPING INDICATOR listeners
        socket.on("userTyping", ({ senderId }) => {
            if (senderId === get().selectedUser?._id) {
                set({ isTyping: true });
            }
        });

        socket.on("userStoppedTyping", ({ senderId }) => {
            if (senderId === get().selectedUser?._id) {
                set({ isTyping: false });
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("userTyping");       // ⌨️ cleanup
        socket.off("userStoppedTyping"); // ⌨️ cleanup
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
