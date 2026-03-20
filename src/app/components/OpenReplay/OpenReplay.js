'use client';
import { useEffect } from 'react';

const OpenReplay = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('@openreplay/tracker').then(({ default: Tracker }) => {
      const tracker = new Tracker({
        projectKey: 'kgJJsFFSAPrUJEMcq4Qu',
        ingestPoint: 'https://marketing.aiagent.attorney/ingest',
        __DISABLE_SECURE_MODE: true,
      });
      tracker.start();
    });
  }, []);

  return null;
};

export default OpenReplay;
