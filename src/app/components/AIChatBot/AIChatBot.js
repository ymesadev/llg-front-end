"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChatUsPopup } from "../../../../public/icons";
import styles from "./AIChatBot.module.css";

// Normalize any legacy saved message text that might contain JSON blobs or a leading "="
function normalizeMessageText(text) {
  try {
    if (typeof text !== 'string') return text;
    const trimmed = text.trim();
    const noEq = trimmed.startsWith('=') ? trimmed.slice(1) : trimmed;
    // If it's a JSON blob like {"response":"...","conversationId":"..."}
    if (noEq.startsWith('{') && noEq.endsWith('}')) {
      try {
        const parsed = JSON.parse(noEq);
        const inner =
          (typeof parsed?.response === 'string' && parsed.response) ||
          (typeof parsed?.message === 'string' && parsed.message) ||
          (typeof parsed?.output === 'string' && parsed.output);
        if (inner) return inner;
      } catch {
        // fall through to return noEq
      }
    }
    return noEq;
  } catch {
    return text;
  }
}

const AIChatBot = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Generate unique user ID and load chat history
  useEffect(() => {
    // Generate or retrieve user ID
    let storedUserId = localStorage.getItem('chatbot_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot_user_id', storedUserId);
    }
    setUserId(storedUserId);

    // Check for welcome message update version
    const welcomeMessageVersion = localStorage.getItem('chatbot_welcome_version');
    const currentVersion = '2.0'; // Updated version for new welcome message

    // Load chat history
    const savedMessages = localStorage.getItem(`chatbot_messages_${storedUserId}`);
    if (savedMessages && welcomeMessageVersion === currentVersion) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects and normalize text
        const messagesWithDates = parsedMessages.map(message => ({
          ...message,
          text: normalizeMessageText(message.text),
          timestamp: new Date(message.timestamp)
        }));
        setMessages(messagesWithDates);
        // Overwrite any legacy/badly formatted texts in localStorage
        try {
          localStorage.setItem(`chatbot_messages_${storedUserId}`, JSON.stringify(messagesWithDates));
        } catch {}
      } catch (error) {
        console.error('Error loading chat history:', error);
        // If there's an error, start with welcome message
        setMessages([
          {
            id: 1,
            text: normalizeMessageText("Hello, how can I assist you with your case"),
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    } else {
      // Force update welcome message for all users
      setMessages([
        {
          id: 1,
          text: normalizeMessageText("Hello, how can I assist you with your case"),
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      // Set the new version
      localStorage.setItem('chatbot_welcome_version', currentVersion);
    }

    // Load conversation ID
    const savedConversationId = localStorage.getItem(`chatbot_conversation_${storedUserId}`);
    if (savedConversationId) {
      setConversationId(savedConversationId);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (userId && messages.length > 0) {
      localStorage.setItem(`chatbot_messages_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  // Save conversation ID to localStorage
  useEffect(() => {
    if (userId && conversationId) {
      localStorage.setItem(`chatbot_conversation_${userId}`, conversationId);
    }
  }, [conversationId, userId]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent scroll propagation to parent document
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleScroll = (e) => {
      e.stopPropagation();
    };

    const handleWheel = (e) => {
      e.stopPropagation();
    };

    const handleTouchMove = (e) => {
      e.stopPropagation();
    };

    messagesContainer.addEventListener('scroll', handleScroll, { passive: true });
    messagesContainer.addEventListener('wheel', handleWheel, { passive: true });
    messagesContainer.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
      messagesContainer.removeEventListener('wheel', handleWheel);
      messagesContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Track message sent for marketing
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'message_sent', {
        event_category: 'Chat',
        event_label: 'User Message',
        value: 1
      });
    }

    try {
      // Get attribution data from localStorage
      const attributionData = {
        page_url: localStorage.getItem('page_url') || null,
        page_source: localStorage.getItem('page_source') || null,
        campaign_type: localStorage.getItem('campaign_type') || null,
        utm_source: localStorage.getItem('utm_source') || null,
        utm_medium: localStorage.getItem('utm_medium') || null,
        utm_campaign: localStorage.getItem('utm_campaign') || null,
        utm_content: localStorage.getItem('utm_content') || null,
        utm_term: localStorage.getItem('utm_term') || null,
        referrer: localStorage.getItem('referrer') || null,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationId: conversationId,
          userId: userId,
          ...attributionData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Normalize the bot text so UI always shows plain text
        let botText = '';
        try {
          if (typeof data?.response === 'string') {
            const raw = data.response.trim();
            const noEq = raw.startsWith('=') ? raw.slice(1) : raw;
            try {
              const parsed = JSON.parse(noEq);
              botText = typeof parsed?.response === 'string' ? parsed.response : noEq;
            } catch {
              botText = noEq; // not JSON, use as-is
            }
          } else if (typeof data === 'string') {
            const raw = data.trim();
            const noEq = raw.startsWith('=') ? raw.slice(1) : raw;
            try {
              const parsed = JSON.parse(noEq);
              botText = parsed?.response ?? noEq;
            } catch {
              botText = noEq;
            }
          } else {
            botText = data?.response ?? data?.message ?? data?.output ?? '';
          }
        } catch {
          botText = data?.response ?? '';
        }

        const botMessage = {
          id: Date.now() + 1,
          text: botText,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
        
        // Set conversation ID if this is the first message
        if (!conversationId) {
          setConversationId(data.conversationId);
        }

        // Track bot response for marketing
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'message_received', {
            event_category: 'Chat',
            event_label: 'Bot Response',
            value: 1
          });
        }
      } else {
        // Handle different types of errors from the API
        let errorText = data.error || "Failed to get response";
        
        // If it's a timeout error, show a more specific message
        if (data.errorType === 'AbortError' || response.status === 408) {
          errorText = "The AI is taking longer than expected to respond. Please wait a moment or try again.";
        } else if (response.status === 503) {
          errorText = "Our AI system is temporarily unavailable. Please try again in a moment.";
        } else if (response.status === 422) {
          errorText = "There was an issue processing your message. Please try again.";
        }
        
        const errorMessage = {
          id: Date.now() + 1,
          text: errorText,
          sender: "bot",
          timestamp: new Date(),
          isError: true,
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Handle network errors or other issues
      let errorText = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorText = "Network connection issue. Please check your internet connection and try again.";
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Track chat button click for marketing
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'chat_button_click', {
        event_category: 'Chat',
        event_label: 'Modal Button',
        value: 1
      });
    }
  };

  const quickReplies = [
    "What services do you offer?",
    "How can I get a free consultation?",
    "What are your office hours?",
    "Do you handle personal injury cases?",
  ];

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  const clearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history? This action cannot be undone.')) {
      const welcomeMessage = {
        id: 1,
        text: "Hello, how can I assist you with your case",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      setConversationId(null);
      
      // Clear from localStorage
      if (userId) {
        localStorage.removeItem(`chatbot_messages_${userId}`);
        localStorage.removeItem(`chatbot_conversation_${userId}`);
      }
    }
  };

  // Hide AIChatBot on live-chat page
  if (pathname === "/live-chat") {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`${styles.chatButton} ${isOpen ? styles.buttonClicked : ""}`}
        aria-label="Open chat"
      >
        <p>Let's Chat</p>
        <ChatUsPopup />
      </button>

      {/* Chat Window */}
      <div
        className={`${styles.chatbox} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.title}>Live Chat</div>
            <div className={styles.statusContainer}>
              <div className={styles.onlineStatus}></div>
              <p>Online</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {messages.length > 1 && (
              <button
                onClick={clearChatHistory}
                className={styles.clearButton}
                aria-label="Clear chat history"
                title="Clear chat history"
              >
                🗑️
              </button>
            )}
            <button
              onClick={toggleChat}
              className={styles.closeButton}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className={styles.messages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === "user" ? styles.userMessage : styles.botMessage
              } ${message.isError ? styles.errorMessage : ""}`}
            >
              <div
                className={styles.messageText}
                dangerouslySetInnerHTML={{ __html: message.text }}
              ></div>
              <div className={styles.messageTime}>
                {message?.timestamp ? new Date(message.timestamp)?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) : ''}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className={styles.suggestions}>
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className={styles.suggestionButton}
                disabled={isLoading}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={styles.inputContainer}>
          <form onSubmit={handleSubmit} className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
