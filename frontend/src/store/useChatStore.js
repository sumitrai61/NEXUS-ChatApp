import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { normalizeId } from "../lib/utils";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create ((set,get) => ({
       messages: [],
       users: [],
       selectedUser:null,
       unreadCounts: {},
       highlightMessageIds: {},
       animatedMessageIds: {},
       pendingHighlightCounts: {},
       isUsersLoading: false,
       isMessagesLoading:false,

      getUsers: async() => {
        set({ isUsersLoading: true});
        try{
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        }catch(error){
          toast.error(error.response.data.message);
        }finally {
            set({ isUsersLoading :false });
        }
      },

      getMessages : async (userId) =>{
        const normalizedUserId = normalizeId(userId);
        set({ isMessagesLoading: true});
        try{
           const res = await axiosInstance.get(`/messages/${userId}`);
           const messages = res.data;
           const { pendingHighlightCounts, animatedMessageIds } = get();
           const count = pendingHighlightCounts[normalizedUserId] || 0;
           const authUser = useAuthStore.getState().authUser;
           const authUserId = normalizeId(authUser?._id);

           const newHighlights = {};
           if (count > 0) {
             const incomingMessages = messages.filter(
               (m) => normalizeId(m.senderId) !== authUserId
             );
             incomingMessages.slice(-count).forEach((m) => {
               if (!animatedMessageIds[m._id]) {
                 newHighlights[m._id] = true;
               }
             });
           }

           set((state) => ({
             messages,
             highlightMessageIds: {
               ...state.highlightMessageIds,
               ...newHighlights,
             },
           }));
        } catch(error){
          toast.error(error.response.data.message);
        }finally{
            set({ isMessagesLoading: false}); 
        }
      },

      sendMessage : async (messageData) => {
        const {selectedUser,messages} = get()
        try{
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
          set({messages:[...messages,res.data]})
        } catch(error) {
          toast.error(error.response.data.message);
        }
      },
      
      subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
          const { selectedUser } = get();
          const authUser = useAuthStore.getState().authUser;

          if (normalizeId(newMessage.senderId) === normalizeId(authUser?._id)) return;

          if (selectedUser && normalizeId(newMessage.senderId) === normalizeId(selectedUser._id)) {
            const { animatedMessageIds } = get();
            const shouldHighlight = !animatedMessageIds[newMessage._id];

            set((state) => ({
              messages: [...state.messages, newMessage],
              highlightMessageIds: shouldHighlight
                ? {
                    ...state.highlightMessageIds,
                    [newMessage._id]: true,
                  }
                : state.highlightMessageIds,
            }));
          } else {
            const senderId = normalizeId(newMessage.senderId);
            set((state) => ({
              unreadCounts: {
                ...state.unreadCounts,
                [senderId]: (state.unreadCounts[senderId] || 0) + 1,
              },
            }));
          }
        });
      },

      unsubscribeFromMessages: () =>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },

      markMessageHighlightComplete: (messageId) => {
        set((state) => {
          if (!state.highlightMessageIds[messageId]) return state;

          const { [messageId]: _, ...restHighlights } =
            state.highlightMessageIds;

          return {
            highlightMessageIds: restHighlights,
            animatedMessageIds: {
              ...state.animatedMessageIds,
              [messageId]: true,
            },
          };
        });
      },

      markAllHighlightsComplete: () => {
        set((state) => {
          const highlightIds = Object.keys(state.highlightMessageIds);
          if (highlightIds.length === 0) return state;

          const animatedMessageIds = { ...state.animatedMessageIds };
          highlightIds.forEach((id) => {
            animatedMessageIds[id] = true;
          });

          return {
            highlightMessageIds: {},
            animatedMessageIds,
          };
        });
      },

    setSelectedUser: (selectedUser) => {
      if (selectedUser) {
        const userId = normalizeId(selectedUser._id);
        set((state) => {
          const unreadCount = state.unreadCounts[userId] || 0;
          return {
            selectedUser,
            messages: [],
            highlightMessageIds: {},
            unreadCounts: {
              ...state.unreadCounts,
              [userId]: 0,
            },
            pendingHighlightCounts: {
              ...state.pendingHighlightCounts,
              [userId]: unreadCount,
            },
          };
        });
      } else {
        get().markAllHighlightsComplete();
        set({ selectedUser: null });
      }
    },
}));