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
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widgets.leadconnectorhq.com/loader.js";
    script.async = true;
    script.setAttribute(
      "data-resources-url",
      "https://widgets.leadconnectorhq.com/chat-widget/loader.js"
    );
    script.setAttribute("data-widget-id", "67eae95f331e4f0cb95bd413");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className={styles.container}>
      <div
        data-chat-widget
        data-widget-id="67eae95f331e4f0cb95bd413"
        data-location-id="OpuRBif1UwDh1UMMiJ7o"
      ></div>
    </div>
  );
}
