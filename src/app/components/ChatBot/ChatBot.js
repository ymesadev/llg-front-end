"use client";

import { useEffect, useState } from "react";
import { FaComments } from "react-icons/fa";
import { PiMinusCircleLight } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";

import styles from "./ChatBot.module.css";

export default function ChatbotPopup({ open }) {
  const [isOpen, setIsOpen] = useState(open);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { text: "How can I assist you today?", sender: "bot" },
  ]);

  const suggestions = [
    "What are your practice areas?",
    "How can I schedule a consultation?",
    "What are your fees?",
  ];

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const sendMessage = (message) => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
      ]);

      // Simulate bot response after a short delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Thank you for reaching out! We'll get back to you soon.",
            sender: "bot",
          },
        ]);
      }, 1000);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue(""); // Clear input field after sending
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
          <div onClick={() => setIsOpen(false)} className={styles.closeButton}>
            <PiMinusCircleLight />
          </div>
        </div>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`${
                msg.sender === "bot" ? styles.botMessage : styles.userMessage
              } ${styles.message}`}
            >
              {msg.text}
            </p>
          ))}
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.suggestions}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={styles.suggestionButton}
                onClick={() => sendMessage(suggestion)}
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
