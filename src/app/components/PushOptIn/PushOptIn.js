"use client";

import { useState, useEffect } from "react";
import styles from "./PushOptIn.module.css";
import { trackEvent } from "@/app/utils/analytics";

export default function PushOptIn() {
  const [show, setShow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Only show on mobile, only once, only if push is supported
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem("pushOptInDismissed")) return;

    const timer = setTimeout(() => setShow(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    trackEvent("push_optin_clicked");
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setSubscribed(true);
        trackEvent("push_optin_granted");
        localStorage.setItem("pushOptInDismissed", "1");
        // Store subscription for later use
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager?.subscribe({
            userVisibleOnly: true,
            applicationServerKey: undefined, // VAPID key to be configured
          }).catch(() => null);
          if (sub) {
            try {
              await fetch("/api/push-subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sub.toJSON()),
              });
            } catch { /* silent */ }
          }
        }
        setTimeout(() => setShow(false), 3000);
      } else {
        localStorage.setItem("pushOptInDismissed", "1");
        setShow(false);
      }
    } catch {
      setShow(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem("pushOptInDismissed", "1");
    setShow(false);
    trackEvent("push_optin_dismissed");
  };

  if (!show) return null;

  if (subscribed) {
    return (
      <div className={styles.banner}>
        <span className={styles.checkmark}>&#10003;</span>
        <span className={styles.text}>You&apos;ll receive updates on Florida law changes.</span>
      </div>
    );
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.bell}>&#128276;</span>
        <span className={styles.text}>Get updates on Florida insurance law changes</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.enable} onClick={handleEnable}>Enable</button>
        <button className={styles.dismiss} onClick={dismiss}>Not now</button>
      </div>
    </div>
  );
}
