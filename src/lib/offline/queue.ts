export type OfflineQueueKind = 'task' | 'brain_dump';
export type OfflineQueueStatus = 'pending' | 'syncing' | 'failed';

export interface OfflineTaskPayload {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  eisenhowerQuadrant?: 'urgent_important' | 'important' | 'urgent' | 'neither';
  estimatedMinutes?: number;
  source?: 'manual' | 'ai_generated' | 'recurring' | 'decomposition' | 'imported' | 'telegram';
}

export interface OfflineBrainDumpPayload {
  text: string;
  capturedAt: number;
}

export interface OfflineQueueItem<T = OfflineTaskPayload | OfflineBrainDumpPayload> {
  id: string;
  kind: OfflineQueueKind;
  status: OfflineQueueStatus;
  payload: T;
  createdAt: number;
  lastError?: string;
}

export interface OfflineTaskDraft {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  synced: boolean;
  syncedAt?: number;
}

export interface OfflineBrainDumpDraft {
  id: string;
  preview: string;
  createdAt: number;
  synced: boolean;
  syncedAt?: number;
}

const DB_NAME = 'resurgo-offline';
const DB_VERSION = 1;
const QUEUE_STORE = 'queue';
const SNAPSHOT_STORE = 'snapshots';
const RECENT_TASKS_KEY = 'recent-task-drafts';
const RECENT_BRAIN_DUMPS_KEY = 'recent-brain-dumps';
const OFFLINE_EVENT = 'resurgo-offline-updated';

function isBrowser() {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

function createId(prefix: OfflineQueueKind) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function emitOfflineUpdate() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(OFFLINE_EVENT));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('Offline queue is only available in the browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        const queueStore = db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
        queueStore.createIndex('status', 'status', { unique: false });
        queueStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(SNAPSHOT_STORE)) {
        db.createObjectStore(SNAPSHOT_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB.'));
  });
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    Promise.resolve(action(store))
      .then((result) => {
        transaction.oncomplete = () => {
          db.close();
          resolve(result);
        };
      })
      .catch((error) => {
        db.close();
        reject(error);
      });

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error(`IndexedDB transaction failed for ${storeName}.`));
    };
  });
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

async function getSnapshot<T>(key: string, fallback: T): Promise<T> {
  if (!isBrowser()) return fallback;
  const result = await withStore<{ key: string; value: T } | undefined>(SNAPSHOT_STORE, 'readonly', async (store) => {
    const entry = await requestToPromise(store.get(key));
    return entry as { key: string; value: T } | undefined;
  });
  return result?.value ?? fallback;
}

async function setSnapshot<T>(key: string, value: T): Promise<void> {
  if (!isBrowser()) return;
  await withStore(SNAPSHOT_STORE, 'readwrite', async (store) => {
    await requestToPromise(store.put({ key, value }));
  });
}

function trimRecent<T extends { createdAt: number }>(items: T[], limit = 12) {
  return [...items].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
}

export async function enqueueOfflineTask(payload: OfflineTaskPayload): Promise<OfflineQueueItem<OfflineTaskPayload>> {
  const item: OfflineQueueItem<OfflineTaskPayload> = {
    id: createId('task'),
    kind: 'task',
    status: 'pending',
    payload,
    createdAt: Date.now(),
  };

  await withStore(QUEUE_STORE, 'readwrite', async (store) => {
    await requestToPromise(store.add(item));
  });

  const drafts = await getRecentTaskDrafts();
  await setSnapshot(
    RECENT_TASKS_KEY,
    trimRecent([
      {
        id: item.id,
        title: payload.title,
        description: payload.description,
        createdAt: item.createdAt,
        synced: false,
      },
      ...drafts,
    ]),
  );

  emitOfflineUpdate();
  return item;
}

export async function enqueueOfflineBrainDump(text: string): Promise<OfflineQueueItem<OfflineBrainDumpPayload>> {
  const payload: OfflineBrainDumpPayload = {
    text,
    capturedAt: Date.now(),
  };

  const item: OfflineQueueItem<OfflineBrainDumpPayload> = {
    id: createId('brain_dump'),
    kind: 'brain_dump',
    status: 'pending',
    payload,
    createdAt: payload.capturedAt,
  };

  await withStore(QUEUE_STORE, 'readwrite', async (store) => {
    await requestToPromise(store.add(item));
  });

  const drafts = await getRecentBrainDumpDrafts();
  await setSnapshot(
    RECENT_BRAIN_DUMPS_KEY,
    trimRecent([
      {
        id: item.id,
        preview: text.slice(0, 160),
        createdAt: item.createdAt,
        synced: false,
      },
      ...drafts,
    ]),
  );

  emitOfflineUpdate();
  return item;
}

export async function listOfflineQueue(): Promise<OfflineQueueItem[]> {
  if (!isBrowser()) return [];
  const items = await withStore<OfflineQueueItem[]>(QUEUE_STORE, 'readonly', async (store) => {
    const request = store.getAll();
    const results = await requestToPromise(request);
    return (results as OfflineQueueItem[]) ?? [];
  });
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function markQueueItemStatus(id: string, status: OfflineQueueStatus, lastError?: string): Promise<void> {
  if (!isBrowser()) return;
  await withStore(QUEUE_STORE, 'readwrite', async (store) => {
    const item = (await requestToPromise(store.get(id))) as OfflineQueueItem | undefined;
    if (!item) return;
    await requestToPromise(store.put({ ...item, status, lastError }));
  });
  emitOfflineUpdate();
}

export async function resolveQueueItem(id: string): Promise<void> {
  if (!isBrowser()) return;
  await withStore(QUEUE_STORE, 'readwrite', async (store) => {
    await requestToPromise(store.delete(id));
  });

  const tasks = await getRecentTaskDrafts();
  const updatedTasks = tasks.map((task) => task.id === id ? { ...task, synced: true, syncedAt: Date.now() } : task);
  await setSnapshot(RECENT_TASKS_KEY, updatedTasks);

  const brainDumps = await getRecentBrainDumpDrafts();
  const updatedBrainDumps = brainDumps.map((entry) => entry.id === id ? { ...entry, synced: true, syncedAt: Date.now() } : entry);
  await setSnapshot(RECENT_BRAIN_DUMPS_KEY, updatedBrainDumps);

  emitOfflineUpdate();
}

export async function getRecentTaskDrafts(): Promise<OfflineTaskDraft[]> {
  return getSnapshot<OfflineTaskDraft[]>(RECENT_TASKS_KEY, []);
}

export async function getRecentBrainDumpDrafts(): Promise<OfflineBrainDumpDraft[]> {
  return getSnapshot<OfflineBrainDumpDraft[]>(RECENT_BRAIN_DUMPS_KEY, []);
}

export function subscribeOfflineQueue(callback: () => void): () => void {
  if (!isBrowser()) return () => undefined;
  const listener = () => callback();
  window.addEventListener(OFFLINE_EVENT, listener);
  return () => window.removeEventListener(OFFLINE_EVENT, listener);
}

export function getOfflineEventName() {
  return OFFLINE_EVENT;
}
