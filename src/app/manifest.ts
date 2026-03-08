import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // ═══════════════════════════════════════════════════════════════════════════
    // CORE PWA METADATA (App Store Optimized)
    // ═══════════════════════════════════════════════════════════════════════════
    name: 'Resurgo - AI Productivity Assistant',
    short_name: 'Resurgo',
    description: 'Turn tasks, goals, habits, and focus into one execution system. Resurgo is an offline-friendly AI productivity assistant for planning, capture, and follow-through.',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // APP CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════
    start_url: '/?source=pwa',
    id: '/Resurgo-app',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui', 'window-controls-overlay'],
    background_color: '#0A0A0B',
    theme_color: '#14B899',
    orientation: 'portrait-primary',
    lang: 'en-US',
    dir: 'ltr',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // APP STORE CATEGORIES
    // ═══════════════════════════════════════════════════════════════════════════
    categories: [
      'productivity',
      'lifestyle',
      'business',
      'utilities',
      'education',
    ],
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ICONS (Multiple sizes for all platforms)
    // ═══════════════════════════════════════════════════════════════════════════
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    
    // ═══════════════════════════════════════════════════════════════════════════
    // APP SCREENSHOTS (For app store listings)
    // Note: form_factor and label are standard manifest properties but not in Next.js types
    // ═══════════════════════════════════════════════════════════════════════════
    screenshots: [
      {
        src: '/screenshots/dashboard-mobile.png',
        sizes: '390x844',
        type: 'image/png',
      },
      {
        src: '/screenshots/habits-mobile.png',
        sizes: '390x844',
        type: 'image/png',
      },
      {
        src: '/screenshots/goals-mobile.png',
        sizes: '390x844',
        type: 'image/png',
      },
      {
        src: '/screenshots/dashboard-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
      },
    ],
    
    // ═══════════════════════════════════════════════════════════════════════════
    // APP SHORTCUTS (Quick actions from home screen)
    // ═══════════════════════════════════════════════════════════════════════════
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Home',
        description: 'Open your command center',
        url: '/dashboard?source=shortcut',
        icons: [{ src: '/icons/shortcut-dashboard.png', sizes: '96x96' }],
      },
      {
        name: 'Open Tasks',
        short_name: 'Tasks',
        description: 'Review and capture task queue items',
        url: '/tasks?source=shortcut',
        icons: [{ src: '/icons/shortcut-habits.png', sizes: '96x96' }],
      },
      {
        name: 'View Goals',
        short_name: 'Goals',
        description: 'Check your goal progress',
        url: '/goals?source=shortcut',
        icons: [{ src: '/icons/shortcut-goals.png', sizes: '96x96' }],
      },
      {
        name: 'Plan Today',
        short_name: 'Today',
        description: 'Jump into daily planning and execution',
        url: '/calendar?source=shortcut',
        icons: [{ src: '/icons/shortcut-add.png', sizes: '96x96' }],
      },
    ],
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RELATED APPLICATIONS (Native app stores)
    // ═══════════════════════════════════════════════════════════════════════════
    related_applications: [
      // Uncomment when you have native apps
      // {
      //   platform: 'play',
      //   url: 'https://play.google.com/store/apps/details?id=app.ascend.habits',
      //   id: 'app.ascend.habits',
      // },
      // {
      //   platform: 'itunes',
      //   url: 'https://apps.apple.com/app/ascend-habit-tracker/id123456789',
      // },
    ],
    prefer_related_applications: false,
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PROTOCOL HANDLERS (Deep linking)
    // ═══════════════════════════════════════════════════════════════════════════
    protocol_handlers: [
      {
        protocol: 'web+resurgo',
        url: '/share?url=%s',
      },
    ],
  };
}

