"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChatUsPopup } from "../../../../public/icons";
import styles from "./LiveChatButton.module.css";

const LiveChatButton = () => {
  const router = useRouter();

  const handleChatClick = () => {
    // Track button click for marketing
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'live_chat_button_click', {
        event_category: 'Live Chat',
        event_label: 'Floating Button',
        value: 1
      });
    }

    // Navigate to live chat page
    router.push('/live-chat');
  };

  return (
    <button
      onClick={handleChatClick}
      className={styles.chatButton}
      aria-label="Open live chat"
    >
      <p>Let's Chat</p>
      <ChatUsPopup />
    </button>
  );
};

export default LiveChatButton;
