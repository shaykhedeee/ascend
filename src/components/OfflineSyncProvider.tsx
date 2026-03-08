'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  listOfflineQueue,
  markQueueItemStatus,
  resolveQueueItem,
  type OfflineBrainDumpPayload,
  type OfflineQueueItem,
  type OfflineTaskPayload,
} from '@/lib/offline/queue';

async function syncQueueItem(item: OfflineQueueItem) {
  const endpoint = item.kind === 'task' ? '/api/offline/queue/task' : '/api/offline/queue/brain-dump';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item.payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Sync failed with status ${response.status}`);
  }
}

export default function OfflineSyncProvider() {
  const syncingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (syncingRef.current || typeof navigator === 'undefined' || !navigator.onLine) {
      return;
    }

    syncingRef.current = true;

    try {
      const items = await listOfflineQueue();
      for (const item of items) {
        try {
          await markQueueItemStatus(item.id, 'syncing');
          await syncQueueItem(item as OfflineQueueItem<OfflineTaskPayload | OfflineBrainDumpPayload>);
          await resolveQueueItem(item.id);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown sync failure';
          await markQueueItemStatus(item.id, 'failed', message);
        }
      }
    } finally {
      syncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void processQueue();

    const onOnline = () => void processQueue();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [processQueue]);

  return null;
}
