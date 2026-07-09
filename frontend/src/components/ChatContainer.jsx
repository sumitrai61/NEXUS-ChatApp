import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, normalizeId } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    highlightMessageIds,
    markMessageHighlightComplete,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if(messageEndRef.current && messages)
    {
       messageEndRef.current.scrollIntoView({ behavior: "smooth"});
    } 
  },[messages]);

if(isMessagesLoading) {
  return (
  <div className="flex-1 flex flex-col overflow-auto">
    <ChatHeader />
    <MessageSkeleton />
    <MessageInput />
   </div>)
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isIncoming =
            normalizeId(message.senderId) !== normalizeId(authUser._id);
          const isHighlighted = isIncoming && highlightMessageIds[message._id];

          return (
          <div
            key={message._id}
            className={`chat ${normalizeId(message.senderId) === normalizeId(authUser._id) ? "chat-end" : "chat-start"} ${
              isHighlighted ? "animate-message-highlight-reveal" : ""
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    normalizeId(message.senderId) === normalizeId(authUser._id)
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col relative overflow-hidden ${
              isHighlighted ? "ring-2 ring-primary/40" : ""
            }`}>
              {isHighlighted && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[inherit] bg-primary/35 animate-message-highlight-fade pointer-events-none"
                  onAnimationEnd={() =>
                    markMessageHighlightComplete(message._id)
                  }
                />
              )}
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 relative"
                />
              )}
              {message.text && <p className="relative">{message.text}</p>}
            </div>
          </div>
        );
        })}
      </div>


     <MessageInput />
      
    </div>
  );
};

export default ChatContainer;
