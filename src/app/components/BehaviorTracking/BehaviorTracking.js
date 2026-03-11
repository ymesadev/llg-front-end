"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function push(event, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, page: window.location.pathname, ...data, ts: Date.now() });
}

export default function BehaviorTracking() {
  const pathname = usePathname();
  const sessionStart = useRef(Date.now());
  const scrollMarks = useRef(new Set());
  const timeMarks = useRef(new Set());
  const clickLog = useRef([]);
  const rageTimer = useRef(null);
  const exitFired = useRef(false);

  // Reset per page navigation
  useEffect(() => {
    scrollMarks.current = new Set();
    timeMarks.current = new Set();
    clickLog.current = [];
    exitFired.current = false;
    sessionStart.current = Date.now();
    push("page_view_deep", { path: pathname });
  }, [pathname]);

  // Scroll depth tracking
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop + window.innerHeight;
      const total = el.scrollHeight;
      const pct = Math.floor((scrolled / total) * 100);

      for (const mark of [25, 50, 75, 90, 100]) {
        if (pct >= mark && !scrollMarks.current.has(mark)) {
          scrollMarks.current.add(mark);
          push("scroll_depth", { depth_pct: mark });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Time on page milestones
  useEffect(() => {
    const milestones = [15, 30, 60, 120, 300]; // seconds
    const timers = milestones.map((sec) =>
      setTimeout(() => {
        if (!timeMarks.current.has(sec)) {
          timeMarks.current.add(sec);
          push("time_on_page", { seconds: sec });
        }
      }, sec * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  // Exit intent (mouse leaves viewport upward)
  useEffect(() => {
    const handleMouseOut = (e) => {
      if (e.clientY <= 5 && !exitFired.current) {
        exitFired.current = true;
        const timeSpent = Math.floor((Date.now() - sessionStart.current) / 1000);
        const maxScroll = Math.max(...[...scrollMarks.current], 0);
        push("exit_intent", { time_on_page_sec: timeSpent, max_scroll_pct: maxScroll });
      }
    };
    document.addEventListener("mouseleave", handleMouseOut);
    return () => document.removeEventListener("mouseleave", handleMouseOut);
  }, [pathname]);

  // Rage click detection (3+ clicks in same spot within 500ms)
  useEffect(() => {
    const handleClick = (e) => {
      const now = Date.now();
      const { clientX: x, clientY: y } = e;
      const target = e.target?.tagName || "UNKNOWN";
      const text = (e.target?.innerText || "").slice(0, 60);

      // Track CTA clicks
      const isCTA = ["BUTTON", "A"].includes(target) || e.target?.closest("button,a");
      if (isCTA) {
        push("cta_click", {
          element: target,
          text,
          x: Math.round(x),
          y: Math.round(y),
          href: e.target?.closest("a")?.href || null,
        });
      }

      // Rage click detection
      clickLog.current = clickLog.current.filter((c) => now - c.t < 1000);
      const nearby = clickLog.current.filter(
        (c) => Math.abs(c.x - x) < 30 && Math.abs(c.y - y) < 30
      );
      clickLog.current.push({ t: now, x, y });

      if (nearby.length >= 2) {
        clearTimeout(rageTimer.current);
        rageTimer.current = setTimeout(() => {
          push("rage_click", { x: Math.round(x), y: Math.round(y), element: target, text });
          clickLog.current = [];
        }, 100);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  // Form interaction tracking (start, field focus, abandon)
  useEffect(() => {
    const formStarts = new Set();

    const handleFocus = (e) => {
      const form = e.target?.closest("form");
      if (!form) return;
      const formId = form.id || form.className?.split(" ")[0] || "form";
      if (!formStarts.has(formId)) {
        formStarts.add(formId);
        push("form_start", { form_id: formId, field: e.target.name || e.target.type });
      }
      push("form_field_focus", { form_id: formId, field: e.target.name || e.target.type });
    };

    const handleSubmit = (e) => {
      const form = e.target?.closest("form");
      if (!form) return;
      const formId = form.id || form.className?.split(" ")[0] || "form";
      push("form_submit", { form_id: formId });
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("submit", handleSubmit);
    };
  }, [pathname]);

  // Session heartbeat (sends engagement ping every 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - sessionStart.current) / 1000);
      const maxScroll = Math.max(...[...scrollMarks.current], 0);
      push("session_heartbeat", { time_on_page_sec: timeSpent, max_scroll_pct: maxScroll });
    }, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
