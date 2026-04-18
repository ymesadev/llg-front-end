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

const INSURER_MAP = {
  'allstate': 'Allstate', 'state-farm': 'State Farm', 'castle-key': 'Castle Key',
  'kin-insurance': 'Kin Insurance', 'american-integrity': 'American Integrity',
  'citizens': 'Citizens Property Insurance', 'universal-property': 'Universal Property & Casualty',
  'heritage-insurance': 'Heritage Insurance', 'tower-hill': 'Tower Hill',
  'manatee': 'Manatee Insurance', 'great-lakes': 'Great Lakes Insurance',
  'american-home-shield': 'American Home Shield', 'homeowners-choice': 'Homeowners Choice',
  'security-first': 'Security First', 'fednat': 'FedNat',
};

function getContextFromUrl(pathname) {
  const slug = (pathname || '').toLowerCase().replace(/^\//, '');

  let insurer = null;
  for (const [key, name] of Object.entries(INSURER_MAP)) {
    if (slug.includes(key)) { insurer = name; break; }
  }

  let opener, suggestions;

  if (/qualify/.test(slug)) {
    opener = "I see you started the qualification form. Need help with any of the questions? I'm here.";
    suggestions = ["What do I need to qualify?", "How long does the process take?", "Is the consultation really free?", "What happens after I submit?"];
  } else if (insurer) {
    opener = `Having trouble with ${insurer}? You're not alone — I can check if you have a case in about 30 seconds.`;
    suggestions = [`${insurer} denied my claim`, "My claim was underpaid", "They're taking too long to respond", "I need help filing a claim"];
  } else if (/roof[-_]?(damage|leak|claim)/.test(slug)) {
    opener = "Roof damage is one of the most common claims we handle. Has your insurance company responded yet?";
    suggestions = ["My roof claim was denied", "Insurance says it's pre-existing", "How do I file a roof claim?", "Storm damaged my roof"];
  } else if (/water[-_]?damage|flood|pipe/.test(slug)) {
    opener = "Water damage can get expensive fast. Let me check if your insurance should be covering this.";
    suggestions = ["My water damage claim was denied", "Pipe burst in my home", "Insurance won't cover the full cost", "How do I document water damage?"];
  } else if (/mold/.test(slug)) {
    opener = "Mold damage is stressful, and insurance companies love to deny these. Want me to check if you qualify for help?";
    suggestions = ["Insurance denied my mold claim", "I found mold after water damage", "How much does mold remediation cost?", "Is mold covered by insurance?"];
  } else if (/hurricane|storm|wind/.test(slug)) {
    opener = "Storm damage claims have strict deadlines in Florida. Has your insurance company made you an offer yet?";
    suggestions = ["Hurricane damaged my property", "Insurance lowballed my claim", "How long do I have to file?", "They sent an adjuster but denied it"];
  } else if (/fire[-_]?damage|smoke|lightning/.test(slug)) {
    opener = "Fire damage claims can be complex. I can check if you qualify for legal help — takes about 30 seconds.";
    suggestions = ["My fire damage claim was denied", "Insurance isn't covering everything", "Lightning struck my home", "How do I file a fire claim?"];
  } else if (/denied|denial|bad[-_]?faith|underpaid/.test(slug)) {
    opener = "A denied claim doesn't mean it's over. Want me to check if you have options?";
    suggestions = ["My claim was denied", "They underpaid my claim", "Insurance is acting in bad faith", "Can I appeal a denial?"];
  } else if (/ssdi|disability|social[-_]?security/.test(slug)) {
    opener = "The disability process can be overwhelming. Want me to check if you qualify for help with your claim?";
    suggestions = ["I was denied disability benefits", "How do I apply for SSDI?", "My disability appeal was rejected", "How long does the process take?"];
  } else if (/personal[-_]?injury|accident/.test(slug)) {
    opener = "Dealing with an injury is hard enough without the legal stress. I can help you figure out your options.";
    suggestions = ["I was in a car accident", "How do I know if I have a case?", "What compensation can I get?", "Is the consultation free?"];
  } else if (/property[-_]?damage/.test(slug)) {
    opener = "Dealing with a property damage claim? I can check if you qualify for legal help — takes 30 seconds.";
    suggestions = ["My property was damaged", "Insurance denied my claim", "They're offering too little", "How does the process work?"];
  } else {
    opener = "Hi — I'm here if you have questions about your situation. How can I help?";
    suggestions = ["I have a property damage claim", "I need help with disability benefits", "I was injured in an accident", "How does the free consultation work?"];
  }

  return { opener, insurer, suggestions };
}

const AIChatBot = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cookieVisible, setCookieVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Detect article pages (which have their own sticky CTA)
  const [hasStickyCta, setHasStickyCta] = useState(false);
  useEffect(() => {
    const check = () => setHasStickyCta(document.body.hasAttribute("data-article-page"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-article-page"] });
    return () => observer.disconnect();
  }, []);

  // Track cookie consent banner visibility so we can avoid overlap on mobile
  useEffect(() => {
    const check = () => setCookieVisible(!localStorage.getItem("cookieConsent"));
    check();
    window.addEventListener("consentUpdated", check);
    return () => window.removeEventListener("consentUpdated", check);
  }, []);

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
    const currentVersion = '3.1'; // Qualify-page-aware welcome messages

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
            text: normalizeMessageText(getContextFromUrl(window.location.pathname).opener),
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
          text: normalizeMessageText(getContextFromUrl(window.location.pathname).opener),
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

  // Handle mobile keyboard resize via visualViewport API
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const handleResize = () => {
      const chatbox = document.querySelector('[data-chatbox]');
      if (chatbox && isOpen) {
        chatbox.style.height = `${window.visualViewport.height}px`;
      }
    };
    const handleScrollRestore = () => {
      const chatbox = document.querySelector('[data-chatbox]');
      if (chatbox && isOpen) {
        chatbox.style.height = `${window.visualViewport.height}px`;
      }
    };
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleScrollRestore);
    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.visualViewport.removeEventListener('scroll', handleScrollRestore);
      // Reset height when closing
      const chatbox = document.querySelector('[data-chatbox]');
      if (chatbox) chatbox.style.height = '';
    };
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

  // Mobile keyboard handling — resize chat when keyboard opens/closes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport || !isOpen) return;
    const handleResize = () => {
      const chatbox = document.querySelector('[data-chatbox]');
      if (chatbox) {
        chatbox.style.height = `${window.visualViewport.height}px`;
      }
    };
    window.visualViewport.addEventListener('resize', handleResize);
    handleResize();
    return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Scroll-based engagement triggers
  useEffect(() => {
    let lastCheck = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastCheck < 200) return;
      lastCheck = now;

      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrollPct = window.scrollY / scrollable;
      const engagements = parseInt(sessionStorage.getItem('chatbot_engagements') || '0');

      // 30% trigger
      if (scrollPct > 0.3 && !isOpen && engagements === 0 && !sessionStorage.getItem('chatbot_30')) {
        sessionStorage.setItem('chatbot_30', '1');
        sessionStorage.setItem('chatbot_engagements', '1');
        setToastMessage(null); // use default opener
        setShowToast(true);
      }

      // 70% re-engagement
      if (scrollPct > 0.7 && !isOpen && engagements === 1 && !sessionStorage.getItem('chatbot_70')) {
        sessionStorage.setItem('chatbot_70', '1');
        sessionStorage.setItem('chatbot_engagements', '2');
        setToastMessage("Still reading? I can give you a quick answer about your specific situation if you want.");
        setShowToast(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Listen for "open chatbot" events from article page buttons
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setShowToast(false);
    };
    window.addEventListener('openSmileyChat', handleOpenChat);
    return () => window.removeEventListener('openSmileyChat', handleOpenChat);
  }, []);

  // Dwell time re-engagement
  useEffect(() => {
    const timer = setTimeout(() => {
      const engagements = parseInt(sessionStorage.getItem('chatbot_engagements') || '0');
      if (!isOpen && engagements < 2) {
        sessionStorage.setItem('chatbot_engagements', String(engagements + 1));
        setToastMessage("Take your time — when you're ready, I can check if your claim qualifies. No commitment.");
        setShowToast(true);
      }
    }, 180000); // 3 minutes
    return () => clearTimeout(timer);
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

    // Track chatbot interaction in OpenReplay
    if (typeof window !== 'undefined' && window.__or_event) {
      window.__or_event('chatbot_message', {
        page: window.location.pathname,
        message_length: messageText.trim().length,
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
          article_slug: window.location.pathname.replace(/^\//, ''),
          page_title: document.title,
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

  const quickReplies = getContextFromUrl(pathname).suggestions || [
    "I have a property damage claim",
    "I need help with disability benefits",
    "I was injured in an accident",
    "How does the free consultation work?",
  ];

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  const clearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history? This action cannot be undone.')) {
      const welcomeMessage = {
        id: 1,
        text: getContextFromUrl(window.location.pathname).opener,
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
    <div className={`${styles.container} ${cookieVisible ? styles.cookieBump : ""}`} data-floating-cta="lets-chat">
      {/* Toast notification — only on non-article pages */}
      {!hasStickyCta && showToast && !isOpen && (
        <div className={styles.chatToast}>
          <button className={styles.toastDismiss} onClick={() => setShowToast(false)} aria-label="Dismiss">&times;</button>
          <p>{toastMessage || getContextFromUrl(pathname).opener}</p>
          <button className={styles.toastReply} onClick={() => { setIsOpen(true); setShowToast(false); }}>Reply</button>
        </div>
      )}

      {/* Only show floating button on non-article pages */}
      {!hasStickyCta && (
        <button
          onClick={toggleChat}
          className={`${styles.chatButton} ${isOpen ? styles.buttonClicked : ""} ${cookieVisible ? styles.cookieBump : ""}`}
          aria-label="Open chat"
        >
          <p>Let's Chat</p>
          <ChatUsPopup />
        </button>
      )}

      {/* Overlay — tap to close on mobile */}
      {isOpen && (
        <div
          className={styles.chatOverlay}
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
        />
      )}

      {/* Chat Window */}
      <div
        className={`${styles.chatbox} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
        data-chatbox
      >
        {/* Drag handle — mobile bottom sheet indicator */}
        <div className={styles.dragHandle} onClick={() => setIsOpen(false)}>
          <div className={styles.dragBar} />
        </div>

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
        <div ref={messagesContainerRef} className={`${styles.messages} ${messages.length === 1 ? styles.welcomeState : ''}`}>
          {messages.length === 1 ? (
            <div className={styles.welcomeWrapper}>
              <div className={styles.welcomeAvatar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div
                className={styles.messageText}
                dangerouslySetInnerHTML={{ __html: messages[0].text }}
              ></div>
              <div className={styles.welcomeSuggestions}>
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
            </div>
          ) : (
            <>
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
            </>
          )}

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
