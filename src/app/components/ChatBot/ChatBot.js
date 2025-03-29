"use client";

import { useEffect, useState } from "react";
import { FaComments } from "react-icons/fa";
import { PiMinusCircleLight } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";

import styles from "./ChatBot.module.css";

export default function ChatbotPopup({ open }) {
  const [isOpen, setIsOpen] = useState(open);
  const [inputValue, setInputValue] = useState("");
  const suggestions = [
    "What are your practice areas?",
    "How can I schedule a consultation?",
    "What are your fees?",
  ];

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.chatbox} ${
          isOpen ? styles.fadeIn : styles.fadeOut
        }`}
      >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>Louis Law Group</h2>
            <div className={styles.statusContainer}>
              <span className={styles.onlineStatus} />
              <p>Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={styles.closeButton}
          >
            <PiMinusCircleLight />
          </button>
        </div>
        <div className={styles.messages}>
          <p className={styles.message}>How can I assist you today?</p>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.suggestions}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={styles.suggestionButton}
                onClick={() => setInputValue(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Type a message..."
              className={styles.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>
              <VscSend size={20} />
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.chatButton} ${isOpen ? styles.buttonClicked : ""}`}
      >
        <FaComments size={24} />
      </button>
    </div>
  );
}
