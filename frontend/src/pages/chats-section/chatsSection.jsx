import React from "react";
import ChatSidebar from "../../component/chatComponent/sidebar/ChatSidebar";
import Chat from "../../component/chatComponent/chat/Chat";
import "./chatsSection.css";

function ChatsSection() {
  return (
    <div className="chat-section">
      <div className="chat-container">
        <ChatSidebar />
        <Chat />
      </div>
    </div>
  );
}

export default ChatsSection;
