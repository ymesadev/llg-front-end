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

  let opener;
  if (/qualify/.test(slug)) {
    opener = "Hey! I see you're checking if you qualify. Need a hand with anything? I'm right here.";
  } else if (insurer) {
    opener = `Ugh, ${insurer}. We deal with them all the time. What happened with your claim?`;
  } else if (/roof[-_]?(damage|leak|claim)/.test(slug)) {
    opener = "Roof damage? That's a huge one for us. What's your insurance company doing about it?";
  } else if (/water[-_]?damage|flood|pipe/.test(slug)) {
    opener = "Water damage is the worst — it just keeps getting more expensive. Has your insurance responded yet?";
  } else if (/mold/.test(slug)) {
    opener = "Mold claims are tough, insurance companies fight these hard. What's going on with yours?";
  } else if (/hurricane|storm|wind/.test(slug)) {
    opener = "Storm damage? There are deadlines on these in Florida so you're smart to look into it now. What happened?";
  } else if (/fire[-_]?damage|smoke|lightning/.test(slug)) {
    opener = "Fire damage is serious. Are you dealing with your insurance on this? Tell me what's going on.";
  } else if (/denied|denial|bad[-_]?faith|underpaid/.test(slug)) {
    opener = "A denial isn't the end of the road. What did they deny you for?";
  } else if (/ssdi|disability|social[-_]?security/.test(slug)) {
    opener = "Disability claims can be a process. Where are you at with yours — just starting or dealing with a denial?";
  } else if (/personal[-_]?injury|accident/.test(slug)) {
    opener = "Sorry to hear about your situation. What happened? I can point you in the right direction.";
  } else if (/property[-_]?damage/.test(slug)) {
    opener = "Property damage claim? Tell me what happened and I'll let you know if we can help.";
  } else {
    opener = "Hey! What's going on? Tell me a little about your situation and I'll see what we can do for you.";
  }

  return { opener, insurer };
}

// Lightweight analytics: pushes to dataLayer + OpenReplay + beacons to n8n
function trackChat(event, data = {}) {
  if (typeof window === 'undefined') return;
  const payload = { event, page: window.location.pathname, ts: Date.now(), ...data };
  // GA4 via dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  // OpenReplay
  if (window.__or_event) try { window.__or_event(event, payload); } catch {}
  // Beacon to n8n for learning pipeline (fire-and-forget)
  try {
    navigator.sendBeacon(
      'https://smiley.louislawgroup.com/webhook/chat-analytics',
      JSON.stringify(payload)
    );
  } catch {}
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
    const currentVersion = '4.1'; // Conversational tone — feels like texting someone you know

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

  // Lock body scroll when chat is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen) {
      document.body.dataset.chatScrollY = String(window.scrollY);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const savedY = document.body.dataset.chatScrollY;
      if (savedY) {
        window.scrollTo(0, parseInt(savedY));
        delete document.body.dataset.chatScrollY;
      }
    }
    return () => {
      document.body.style.overflow = '';
      const savedY = document.body.dataset.chatScrollY;
      if (savedY) {
        window.scrollTo(0, parseInt(savedY));
        delete document.body.dataset.chatScrollY;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const update = () => {
      const chatbox = document.querySelector('[data-chatbox]');
      if (!chatbox || !isOpen) return;
      const vv = window.visualViewport;
      chatbox.style.height = `${vv.height}px`;
      chatbox.style.top = `${vv.offsetTop}px`;
    };
    window.visualViewport.addEventListener('resize', update);
    window.visualViewport.addEventListener('scroll', update);
    return () => {
      window.visualViewport.removeEventListener('resize', update);
      window.visualViewport.removeEventListener('scroll', update);
      const chatbox = document.querySelector('[data-chatbox]');
      if (chatbox) { chatbox.style.height = ''; chatbox.style.top = ''; }
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
        setToastMessage(null);
        setShowToast(true);
        trackChat('toast_shown', { trigger: 'scroll_30', scroll_pct: 30 });
      }

      // 70% re-engagement
      if (scrollPct > 0.7 && !isOpen && engagements === 1 && !sessionStorage.getItem('chatbot_70')) {
        sessionStorage.setItem('chatbot_70', '1');
        sessionStorage.setItem('chatbot_engagements', '2');
        setToastMessage("Still reading? I can give you a quick answer about your specific situation if you want.");
        setShowToast(true);
        trackChat('toast_shown', { trigger: 'scroll_70', scroll_pct: 70 });
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
      if (!sessionStorage.getItem('chat_start_ts')) sessionStorage.setItem('chat_start_ts', String(Date.now()));
      trackChat('chat_opened', { trigger: 'cta_button', article_slug: window.location.pathname });
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

  const fetchCalSlots = async (lead) => {
    try {
      const res = await fetch('/api/cal-slots');
      const data = await res.json();
      const nextSlots = (data?.slots || []).slice(0, 4);
      if (nextSlots.length === 0) return;

      const slotButtons = nextSlots.map(t => {
        const d = new Date(t);
        const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        return { label: `${day} at ${time}`, time: t };
      });

      const bookingMsg = {
        id: Date.now() + 2,
        text: 'Choose a time for your free consultation:',
        sender: 'bot',
        timestamp: new Date(),
        isBooking: true,
        slots: slotButtons,
        lead,
      };
      setMessages(prev => [...prev, bookingMsg]);
    } catch (err) {
      console.error('Cal.com slot fetch error:', err);
      // Fallback: show direct booking link
      const fallbackMsg = {
        id: Date.now() + 2,
        text: '<a href="https://bookings.louislawgroup.com/pierre-louislawgroup.com/property-insurance-claim-consultation" target="_blank" rel="noopener noreferrer" style="color:#0078ff;text-decoration:underline;font-weight:600;">Click here to schedule your free consultation</a>',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleBookSlot = async (slot, lead) => {
    // Open cal.com booking page with prefilled data
    const params = new URLSearchParams({
      name: lead?.name || '',
      phone: lead?.phone || '',
      'damage-type': lead?.damage || '',
    });
    const bookingUrl = `https://bookings.louislawgroup.com/pierre-louislawgroup.com/property-insurance-claim-consultation?${params.toString()}&date=${encodeURIComponent(slot.time)}`;
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');

    trackChat('booking_slot_clicked', {
      slot_label: slot.label,
      damage_type: lead?.damage || null,
    });

    // Confirm in chat
    const confirmMsg = {
      id: Date.now() + 3,
      text: `Opening booking for <strong>${slot.label}</strong>. Complete the form in the new tab to confirm your free consultation.`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMsg]);

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'booking_slot_selected', {
        event_category: 'Chat',
        event_label: slot.label,
        value: 1
      });
    }
  };

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

    trackChat('chat_message_sent', {
      message_num: messages.filter(m => m.sender === 'user').length + 1,
      message_length: messageText.trim().length,
      is_quick_reply: quickReplies.includes(messageText.trim()),
    });

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

        // If qualified, fetch cal.com slots and show booking options
        if (data.qualified && data.lead) {
          fetchCalSlots(data.lead);
        }

        trackChat('chat_response_received', {
          message_num: messages.filter(m => m.sender === 'bot').length + 1,
          qualified: !!data.qualified,
        });

        if (data.qualified) {
          trackChat('lead_qualified', {
            damage_type: data.lead?.damage || 'unknown',
            insurer: data.lead?.insurer || null,
            message_count: messages.length + 2,
            time_to_qualify_sec: Math.floor((Date.now() - (parseInt(sessionStorage.getItem('chat_start_ts') || Date.now()))) / 1000),
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
    const opening = !isOpen;
    setIsOpen(opening);
    trackChat(opening ? 'chat_opened' : 'chat_closed', {
      trigger: 'floating_button',
      message_count: messages.length,
    });
  };

  const quickReplies = [
    "My insurance is giving me the runaround",
    "I was in an accident",
    "I need help with disability",
    "Can I just ask a quick question?",
  ];

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  const clearChatHistory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Reset chat without confirm dialog (iOS Safari blocks confirm in fixed elements)
    const welcomeMessage = {
      id: 1,
      text: getContextFromUrl(window.location.pathname).opener,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setConversationId(null);
    if (userId) {
      localStorage.removeItem(`chatbot_messages_${userId}`);
      localStorage.removeItem(`chatbot_conversation_${userId}`);
    }
    trackChat('chat_cleared', { message_count: messages.length });
  };

  // Hide AIChatBot on pages where it's distracting
  const isQualifyPage = /\/qualify\b/.test(pathname);
  if (pathname === "/live-chat" || isQualifyPage) {
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

      {/* Chat Window */}
      <div
        className={`${styles.chatbox} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
        data-chatbox
      >
        {/* Header with swipe-down dismiss */}
        <div
          className={styles.header}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            e.currentTarget._swipeStartY = touch.clientY;
            e.currentTarget._swipeStartTime = Date.now();
          }}
          onTouchMove={(e) => {
            if (!e.currentTarget._swipeStartY) return;
            const deltaY = e.touches[0].clientY - e.currentTarget._swipeStartY;
            if (deltaY > 0) {
              const chatbox = e.currentTarget.closest('[data-chatbox]');
              if (chatbox) chatbox.style.transform = `translateY(${deltaY}px)`;
            }
          }}
          onTouchEnd={(e) => {
            const startY = e.currentTarget._swipeStartY;
            const startTime = e.currentTarget._swipeStartTime;
            if (!startY) return;
            const endY = e.changedTouches[0].clientY;
            const deltaY = endY - startY;
            const elapsed = Date.now() - startTime;
            const chatbox = e.currentTarget.closest('[data-chatbox]');
            e.currentTarget._swipeStartY = null;

            if (deltaY > 100 || (deltaY > 40 && elapsed < 300)) {
              setIsOpen(false);
            }
            if (chatbox) chatbox.style.transform = '';
          }}
        >
          <div className={styles.dragHandle}></div>
          <div className={styles.headerInfo}>
            <div className={styles.headerAvatar}>
              <img src="https://login.louislawgroup.com/uploads/pierre_louis_new_003bb95e9b.jpg" alt="Louis Law Group" className={styles.headerAvatarImg} />
            </div>
            <div className={styles.headerDetails}>
              <div className={styles.title}>Louis Law Group</div>
              <div className={styles.statusContainer}>
                <div className={styles.onlineStatus}></div>
                <p>Online now</p>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            {messages.length > 1 && (
              <button
                onClick={clearChatHistory}
                onTouchEnd={clearChatHistory}
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
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageText} dangerouslySetInnerHTML={{__html: messages[0].text}}></div>
              </div>
              <div className={styles.welcomeSuggestions}>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className={styles.quickReplyButton}
                    disabled={isLoading}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const msgClasses = [styles.message, message.sender === "user" ? styles.userMessage : styles.botMessage];
                if (message.isError) msgClasses.push(styles.errorMessage);
                if (message.isBooking) msgClasses.push(styles.bookingMessage);
                return (
                <div key={message.id} className={msgClasses.join(' ')}>
                  <div className={styles.messageText} dangerouslySetInnerHTML={{__html: message.text}}></div>
                  {message.isBooking && message.slots && (
                    <div className={styles.slotGrid}>
                      {message.slots.map((slot, i) => (
                        <button key={i} className={styles.slotButton} onClick={() => handleBookSlot(slot, message.lead)}>
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className={styles.messageTime}>
                    {message?.timestamp ? new Date(message.timestamp)?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ''}
                  </div>
                </div>
                );
              })}
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
