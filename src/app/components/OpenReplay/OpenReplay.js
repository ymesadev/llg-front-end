'use client';
import { useEffect, useCallback } from 'react';

/**
 * OpenReplay — session replay with user identification, page tracking,
 * and conversion event tracking. Gated behind cookie consent.
 *
 * Global API (available after tracker starts):
 *   window.__or_identify(userId, metadata)  — identify a user (e.g. after form submit)
 *   window.__or_event(name, payload)         — track a custom event
 */
const OpenReplay = () => {
  const startTracker = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.__or_tracker) return; // already running

    import('@openreplay/tracker').then(({ default: Tracker }) => {
      const tracker = new Tracker({
        projectKey: 'kgJJsFFSAPrUJEMcq4Qu',
        ingestPoint: 'https://marketing.aiagent.attorney/ingest',
        __DISABLE_SECURE_MODE: true,
        respectDoNotTrack: false,
        capturePerformance: true,
        network: {
          capturePayload: false,
          captureHeaders: false,
          failuresOnly: false,
        },
      });

      tracker.start().then((sessionInfo) => {
        window.__or_tracker = tracker;

        // ── Expose global helpers ──
        window.__or_identify = (userId, metadata = {}) => {
          try {
            tracker.setUserID(userId);
            Object.entries(metadata).forEach(([k, v]) => {
              if (v) tracker.setMetadata(k, String(v));
            });
          } catch (e) { /* silent */ }
        };

        window.__or_event = (name, payload = {}) => {
          try {
            tracker.event(name, payload);
          } catch (e) { /* silent */ }
        };

        // ── Track initial page ──
        tracker.setMetadata('page', window.location.pathname);

        // ── Capture visitor IP ──
        fetch('https://api.ipify.org?format=json')
          .then((r) => r.json())
          .then((d) => { if (d.ip) tracker.setMetadata('ip', d.ip); })
          .catch(() => { /* silent */ });

        // ── Track UTM / attribution from localStorage ──
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'page_source', 'campaign_type'];
        utmKeys.forEach((key) => {
          const val = localStorage.getItem(key);
          if (val) tracker.setMetadata(key, val);
        });
        const referrer = localStorage.getItem('referrer') || document.referrer;
        if (referrer) tracker.setMetadata('referrer', referrer);

        // ── Track Next.js App Router navigation via history ──
        const trackPageChange = () => {
          try {
            tracker.setMetadata('page', window.location.pathname);
            tracker.event('page_view', {
              path: window.location.pathname,
              title: document.title,
              url: window.location.href,
            });
          } catch (e) { /* silent */ }
        };

        const origPush = history.pushState;
        const origReplace = history.replaceState;

        history.pushState = function () {
          origPush.apply(history, arguments);
          setTimeout(trackPageChange, 0);
        };
        history.replaceState = function () {
          origReplace.apply(history, arguments);
          setTimeout(trackPageChange, 0);
        };
        window.addEventListener('popstate', trackPageChange);

        // ── Track key user interactions ──

        // Phone click tracking
        document.addEventListener('click', (e) => {
          const link = e.target.closest('a[href^="tel:"]');
          if (link) {
            window.__or_event?.('phone_click', {
              number: link.href.replace('tel:', ''),
              page: window.location.pathname,
            });
          }
        });

        // Retainer link click tracking
        document.addEventListener('click', (e) => {
          const link = e.target.closest('a[href*="retainer"]');
          if (link) {
            window.__or_event?.('retainer_click', {
              href: link.href,
              page: window.location.pathname,
              text: link.textContent?.trim().slice(0, 80),
            });
          }
        });

        // CTA / button click tracking
        document.addEventListener('click', (e) => {
          const btn = e.target.closest('button, a.btn, [class*="btn"], [class*="Button"]');
          if (btn && !btn.closest('a[href^="tel:"]') && !btn.closest('a[href*="retainer"]')) {
            window.__or_event?.('cta_click', {
              text: btn.textContent?.trim().slice(0, 80),
              page: window.location.pathname,
              tag: btn.tagName,
            });
          }
        });

        // Scroll depth tracking
        let maxScroll = 0;
        const scrollMilestones = [25, 50, 75, 90];
        const firedMilestones = new Set();
        window.addEventListener('scroll', () => {
          const scrollPct = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          );
          if (scrollPct > maxScroll) {
            maxScroll = scrollPct;
            scrollMilestones.forEach((m) => {
              if (scrollPct >= m && !firedMilestones.has(m)) {
                firedMilestones.add(m);
                window.__or_event?.('scroll_depth', {
                  depth: m,
                  page: window.location.pathname,
                });
              }
            });
          }
        }, { passive: true });
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check consent before starting
    const hasConsent = () =>
      localStorage.getItem('cookieConsent') === 'true' &&
      localStorage.getItem('agreedToTerms') === 'true';

    if (hasConsent()) {
      startTracker();
    }

    // Listen for consent granted mid-session
    const onConsent = () => {
      if (hasConsent()) startTracker();
    };
    window.addEventListener('consentUpdated', onConsent);
    return () => window.removeEventListener('consentUpdated', onConsent);
  }, [startTracker]);

  return null;
};

export default OpenReplay;
