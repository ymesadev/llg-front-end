"use client";

import { usePathname } from "next/navigation";
import LiveChatButton from "../LiveChatButton/LiveChatButton";

const ConditionalLiveChatButton = () => {
  const pathname = usePathname();
  
  // Hide LiveChatButton on live-chat page
  if (pathname === "/live-chat") {
    return null;
  }
  
  return <LiveChatButton />;
};

export default ConditionalLiveChatButton;
