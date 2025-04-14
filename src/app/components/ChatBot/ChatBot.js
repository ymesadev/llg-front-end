"use client"; // Only needed in Next.js 13+ App Router

import React, { useEffect } from "react";
import Script from "next/script";
import { ChatUsPopup } from "../../../../public/icons";
import styles from "./ChatBot.module.css";
function ChatBot() {
  useEffect(() => {
    // Function to hide elements inside the shadow root
    const hideShadowElements = () => {
      // 1) Grab the <chat-widget> element
      const chatWidget = document.querySelector("chat-widget");
      if (!chatWidget || !chatWidget.shadowRoot) {
        console.warn("Chat widget or shadow root not found yet.");
        return;
      }

      // 2) Query elements INSIDE the shadow root you want to hide
      // Adjust the selector(s) based on what you see in DevTools
      // For example:
      const otherButton = chatWidget.shadowRoot.querySelector(
        ".lc_text-widget--bubble"
      );

      if (otherButton) {
        otherButton.style.display = "none"; // Hide it
        console.log("Hid the other button inside the shadow root.");
      } else {
        console.warn("No lc_text-widget--bubble found in the shadow root.");
      }
    };

    // Listen for the GHL widget to finish loading, then hide the default bubble/button
    window.addEventListener("LC_chatWidgetLoaded", hideShadowElements);

    return () => {
      window.removeEventListener("LC_chatWidgetLoaded", hideShadowElements);
    };
  }, []);

  // 3) Function to open the chat widget programmatically
  const openWidget = () => {
    if (window?.leadConnector?.chatWidget) {
      window.leadConnector.chatWidget.openWidget();
    } else {
      console.warn("Chat widget not loaded yet.");
    }
  };

  return (
    <>
      {/* Custom "Let’s Chat" button */}
      <button onClick={openWidget} className={styles.chatUs}>
        Let’s Chat
        <ChatUsPopup />
      </button>

      {/* Load the external chat widget script after the page becomes interactive */}
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="67eae95f331e4f0cb95bd413"
        strategy="afterInteractive"
      />
    </>
  );
}

export default ChatBot;
