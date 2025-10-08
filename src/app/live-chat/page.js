"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const LiveChatPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showLongProcessingMessage, setShowLongProcessingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map(message => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
        // If there's an error, start with welcome message
        setMessages([
          {
            id: 1,
            text: "Hello, how can I assist you with your case",
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
          text: "Hello, how can I assist you with your case",
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

    // Track page view for marketing
    if (typeof window !== 'undefined') {
      // Google Analytics tracking
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: 'Live Chat',
          page_location: window.location.href,
          custom_parameter: 'live_chat_page'
        });
      }

      // Facebook Pixel tracking
      if (window.fbq) {
        window.fbq('track', 'PageView', {
          content_name: 'Live Chat Page',
          content_category: 'Chat Support'
        });
      }
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
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        // Check if it has the messages styling (overflow-y: auto)
        const computedStyle = window.getComputedStyle(messagesContainer);
        if (computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
          // Use requestAnimationFrame to ensure DOM is updated
          requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          });
        }
      }
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
    setShowLongProcessingMessage(false);
    
    // Show long processing message after 15 seconds
    const longProcessingTimer = setTimeout(() => {
      if (isLoading) {
        setShowLongProcessingMessage(true);
      }
    }, 15000);

    // Track message sent for marketing
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'message_sent', {
        event_category: 'Live Chat',
        event_label: 'User Message',
        value: 1
      });
    }

    try {
      // Create AbortController for timeout (60 seconds to allow for API processing time)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationId: conversationId,
          userId: userId,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
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
            event_category: 'Live Chat',
            event_label: 'Bot Response',
            value: 1
          });
        }
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      let errorText = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
      // Provide more specific error messages
      if (error.name === 'AbortError') {
        errorText = "The AI system is taking longer than expected to respond. Please try again in a moment or contact us at (833) 657-4812 for immediate assistance.";
      } else if (error.message.includes('Failed to fetch')) {
        errorText = "Unable to connect to our servers. Please check your internet connection and try again.";
      } else if (error.message.includes('timeout')) {
        errorText = "Request timed out. The AI system is processing your message - please wait a moment and try again.";
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
      clearTimeout(longProcessingTimer);
      setIsLoading(false);
      setShowLongProcessingMessage(false);
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

      // Track chat cleared for marketing
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'chat_cleared', {
          event_category: 'Live Chat',
          event_label: 'User Action'
        });
      }
    }
  };

  const goBack = () => {
    // Track back button click for marketing
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'chat_exit', {
        event_category: 'Live Chat',
        event_label: 'Back Button'
      });
    }
    router.back();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        {/* Header with AI Assistant status */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.title}>AI Assistant</div>
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
              onClick={goBack}
              className={styles.closeButton}
              aria-label="Go back"
              title="Go back"
            >
              ←
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === "user" ? styles.userMessage : styles.botMessage
              } ${message.isError ? styles.errorMessage : ""}`}
            >
              <div className={styles.messageText}>{message.text}</div>
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
          
          {/* Long processing message */}
          {showLongProcessingMessage && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.longProcessingMessage}>
                <p>🤖 The AI is taking a bit longer to process your request...</p>
                <p>This is normal for complex queries. Please wait while we generate the best response for you.</p>
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

export default LiveChatPage;
