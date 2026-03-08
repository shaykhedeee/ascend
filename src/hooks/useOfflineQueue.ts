'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getOfflineEventName,
  getRecentBrainDumpDrafts,
  getRecentTaskDrafts,
  listOfflineQueue,
  subscribeOfflineQueue,
  type OfflineBrainDumpDraft,
  type OfflineQueueItem,
  type OfflineTaskDraft,
} from '@/lib/offline/queue';

interface OfflineQueueState {
  isOnline: boolean;
  queueItems: OfflineQueueItem[];
  recentTaskDrafts: OfflineTaskDraft[];
  recentBrainDumpDrafts: OfflineBrainDumpDraft[];
  pendingTaskCount: number;
  pendingBrainDumpCount: number;
  failedCount: number;
  syncingCount: number;
}

const INITIAL_STATE: OfflineQueueState = {
  isOnline: true,
  queueItems: [],
  recentTaskDrafts: [],
  recentBrainDumpDrafts: [],
  pendingTaskCount: 0,
  pendingBrainDumpCount: 0,
  failedCount: 0,
  syncingCount: 0,
};

export function useOfflineQueue() {
  const [state, setState] = useState<OfflineQueueState>(() => ({
    ...INITIAL_STATE,
    isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  }));

  const refresh = useCallback(async () => {
    const [queueItems, recentTaskDrafts, recentBrainDumpDrafts] = await Promise.all([
      listOfflineQueue(),
      getRecentTaskDrafts(),
      getRecentBrainDumpDrafts(),
    ]);

    setState({
      isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
      queueItems,
      recentTaskDrafts,
      recentBrainDumpDrafts,
      pendingTaskCount: queueItems.filter((item) => item.kind === 'task' && item.status !== 'failed').length,
      pendingBrainDumpCount: queueItems.filter((item) => item.kind === 'brain_dump' && item.status !== 'failed').length,
      failedCount: queueItems.filter((item) => item.status === 'failed').length,
      syncingCount: queueItems.filter((item) => item.status === 'syncing').length,
    });
  }, []);

  useEffect(() => {
    void refresh();

    const onConnectionChange = () => void refresh();
    const unsubscribe = subscribeOfflineQueue(() => void refresh());

    window.addEventListener('online', onConnectionChange);
    window.addEventListener('offline', onConnectionChange);
    window.addEventListener(getOfflineEventName(), onConnectionChange as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('online', onConnectionChange);
      window.removeEventListener('offline', onConnectionChange);
      window.removeEventListener(getOfflineEventName(), onConnectionChange as EventListener);
    };
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}
