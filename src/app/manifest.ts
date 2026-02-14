import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // ═══════════════════════════════════════════════════════════════════════════
    // CORE PWA METADATA (App Store Optimized)
    // ═══════════════════════════════════════════════════════════════════════════
    name: 'ASCEND - AI Habit Tracker & Goal Planner',
    short_name: 'ASCEND',
    description: 'Build lasting habits with AI-powered goal decomposition. Track daily habits, earn XP, level up, and achieve your goals with gamified progress tracking. Free habit tracker with analytics.',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // APP CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════
    start_url: '/?source=pwa',
    id: '/ascend-app',
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
      'health',
      'fitness',
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
        description: 'View your progress dashboard',
        url: '/?tab=dashboard&source=shortcut',
        icons: [{ src: '/icons/shortcut-dashboard.png', sizes: '96x96' }],
      },
      {
        name: 'Track Habits',
        short_name: 'Habits',
        description: 'Check off your daily habits',
        url: '/?tab=habits&source=shortcut',
        icons: [{ src: '/icons/shortcut-habits.png', sizes: '96x96' }],
      },
      {
        name: 'View Goals',
        short_name: 'Goals',
        description: 'Check your goal progress',
        url: '/?tab=goals&source=shortcut',
        icons: [{ src: '/icons/shortcut-goals.png', sizes: '96x96' }],
      },
      {
        name: 'Quick Add',
        short_name: 'Add',
        description: 'Quickly add a new habit',
        url: '/?action=add-habit&source=shortcut',
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
        protocol: 'web+ascend',
        url: '/share?url=%s',
      },
    ],
  };
}

