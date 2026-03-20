'use client';
import { useEffect } from 'react';

const OpenReplay = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('@openreplay/tracker').then(({ default: Tracker }) => {
      const tracker = new Tracker({
        projectKey: '2If29NBYmJMJsW3thc0Z',
        ingestPoint: 'https://marketing.aiagent.attorney/ingest',
        __DISABLE_SECURE_MODE: true,
      });
      tracker.start();
    });
  }, []);

  return null;
};

export default OpenReplay;
