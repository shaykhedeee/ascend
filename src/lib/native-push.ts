// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Native Push Notification Service
// Capacitor PushNotifications integration for FCM on Android
// ═══════════════════════════════════════════════════════════════════════════════

import { isNativeApp } from './platform';

/**
 * Dynamically import Capacitor push plugin only when running natively.
 * This prevents build errors when the module isn't available in web context.
 */
async function getPushPlugin() {
  if (!isNativeApp()) return null;
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    return PushNotifications;
  } catch {
    console.warn('[native-push] PushNotifications plugin not available');
    return null;
  }
}

/**
 * Register for push notifications.
 * Returns the FCM token string or null if registration fails / not native.
 */
export async function registerForPush(): Promise<string | null> {
  const Push = await getPushPlugin();
  if (!Push) return null;

  // Check / request permission
  let permStatus = await Push.checkPermissions();
  if (permStatus.receive === 'prompt') {
    permStatus = await Push.requestPermissions();
  }
  if (permStatus.receive !== 'granted') {
    console.log('[native-push] Permission not granted');
    return null;
  }

  // Register with FCM
  return new Promise<string | null>((resolve) => {
    // Success — we get the FCM device token
    Push.addListener('registration', (token) => {
      console.log('[native-push] FCM token:', token.value);
      resolve(token.value);
    });

    // Error
    Push.addListener('registrationError', (err) => {
      console.error('[native-push] Registration error:', err);
      resolve(null);
    });

    Push.register();
  });
}

/**
 * Listen for incoming push notifications (foreground + tapped).
 * Returns a cleanup function to remove all listeners.
 */
export async function addPushListeners(callbacks: {
  onReceived?: (notification: { title?: string; body?: string; data?: Record<string, string> }) => void;
  onTapped?: (notification: { title?: string; body?: string; data?: Record<string, string>; actionId?: string }) => void;
}): Promise<() => void> {
  const Push = await getPushPlugin();
  if (!Push) return () => {};

  const handles: Array<{ remove: () => void }> = [];

  if (callbacks.onReceived) {
    const h = await Push.addListener('pushNotificationReceived', (notification) => {
      callbacks.onReceived?.({
        title: notification.title ?? undefined,
        body: notification.body ?? undefined,
        data: notification.data as Record<string, string> | undefined,
      });
    });
    handles.push(h);
  }

  if (callbacks.onTapped) {
    const h = await Push.addListener('pushNotificationActionPerformed', (action) => {
      callbacks.onTapped?.({
        title: action.notification.title ?? undefined,
        body: action.notification.body ?? undefined,
        data: action.notification.data as Record<string, string> | undefined,
        actionId: action.actionId,
      });
    });
    handles.push(h);
  }

  return () => {
    handles.forEach((h) => h.remove());
  };
}

/**
 * Get the delivered notifications sitting in the notification tray.
 */
export async function getDeliveredNotifications() {
  const Push = await getPushPlugin();
  if (!Push) return [];
  const result = await Push.getDeliveredNotifications();
  return result.notifications;
}

/**
 * Clear all delivered notifications from the tray.
 */
export async function clearAllNotifications() {
  const Push = await getPushPlugin();
  if (!Push) return;
  await Push.removeAllDeliveredNotifications();
}
