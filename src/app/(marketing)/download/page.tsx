// ─────────────────────────────────────────────────────────────────────────────
// RESURGO.life — /download — Android APK Download Page
// Replaces Telegram bot with a native Android experience
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Download Resurgo for Android — Free APK | AI Habit Tracker',
  description:
    'Download the Resurgo Android app (APK). Get native push notifications for morning digests, habit reminders, and AI coaching nudges. Free download, no Play Store needed.',
  keywords: [
    'Resurgo APK', 'download Resurgo', 'Resurgo Android app', 'habit tracker APK',
    'AI habit tracker Android', 'Resurgo mobile app', 'push notifications habit tracker',
  ],
  alternates: { canonical: '/download' },
  openGraph: {
    title: 'Download Resurgo for Android — AI Habit Tracker',
    description: 'Native push notifications, offline quick-view, and the full Resurgo dashboard in your pocket.',
    type: 'website',
    url: '/download',
  },
};

const FEATURES = [
  {
    icon: '🔔',
    title: 'Native Push Notifications',
    description: 'Morning digests, habit reminders, and AI coaching nudges delivered straight to your notification tray — even when the app is closed.',
  },
  {
    icon: '⚡',
    title: 'Instant Launch',
    description: 'Tap the icon and you\'re in. No browser tabs, no URL bar — a full-screen dedicated experience.',
  },
  {
    icon: '📊',
    title: 'Full Dashboard Access',
    description: 'Every feature from the web app: habits, goals, tasks, AI coach, vision board, analytics, gamification — all in your pocket.',
  },
  {
    icon: '🔒',
    title: 'Secure Authentication',
    description: 'Sign in with the same Clerk-powered account. Your data syncs in real-time via Convex — zero setup needed.',
  },
  {
    icon: '🎮',
    title: 'Haptic Feedback',
    description: 'Feel satisfying vibrations when you complete habits, earn XP, or hit streak milestones.',
  },
  {
    icon: '🌙',
    title: 'Smart Quiet Hours',
    description: 'Set quiet hours and Resurgo will batch your notifications intelligently — no buzzing at 2 AM.',
  },
];

const INSTALL_STEPS = [
  { step: 1, title: 'Download the APK', description: 'Tap the download button below to get the latest Resurgo APK file.' },
  { step: 2, title: 'Allow Installation', description: 'Android will ask you to allow installs from this source. Tap "Allow" — this is safe.' },
  { step: 3, title: 'Install & Launch', description: 'Open the downloaded APK and tap "Install". Once done, tap "Open" to start Resurgo.' },
  { step: 4, title: 'Sign In & Enable Notifications', description: 'Sign in with your existing account. Allow push notifications when prompted.' },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0B] via-[#0d1117] to-[#0A0A0B] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,153,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Now Available — Android APK
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Resurgo for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Android
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
            The full Resurgo experience in a native Android app. Get push notifications for morning digests,
            habit reminders, and AI coaching — right on your home screen.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/downloads/resurgo-latest.apk"
              className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-500 hover:shadow-emerald-500/40 active:scale-95"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 5v6h1.17L12 13.17 9.83 11H11V5h2m2-2H9v6H5l7 7 7-7h-4V3zm4 15H5v2h14v-2z" />
              </svg>
              Download APK
            </a>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 text-lg font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              View All Features →
            </Link>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Version 1.0.0 · 4.2 MB · Requires Android 8.0+
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Why Download the App?</h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
          Everything the web app does — plus native Android features you can&#39;t get in a browser.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-emerald-500/40 hover:bg-zinc-900/80"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Steps */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">How to Install</h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
          It takes less than 60 seconds. No Play Store account or credit card needed.
        </p>
        <div className="space-y-6">
          {INSTALL_STEPS.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400 font-bold">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-zinc-400">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison: App vs Telegram */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">App vs. Telegram Bot</h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
          We&#39;re replacing the Telegram bot with a dedicated Android app. Here&#39;s why it&#39;s better.
        </p>
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80">
                <th className="px-6 py-4 font-semibold text-zinc-300">Feature</th>
                <th className="px-6 py-4 font-semibold text-zinc-500">Telegram Bot</th>
                <th className="px-6 py-4 font-semibold text-emerald-400">Android App</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['Push Notifications', '⚠️ Telegram required', '✅ Native FCM'],
                ['Morning Digest', '✅ Text only', '✅ Rich + tappable'],
                ['Habit Tracking', '⚠️ Text commands', '✅ Full visual UI'],
                ['AI Coaching', '⚠️ Limited context', '✅ Full dashboard'],
                ['Goal Management', '❌ Not available', '✅ Full access'],
                ['Analytics', '❌ Basic stats', '✅ Charts & trends'],
                ['Offline Support', '❌ Requires internet', '✅ Cached views'],
                ['Haptic Feedback', '❌ None', '✅ Native vibrations'],
                ['Vision Board', '❌ Not available', '✅ Full access'],
              ].map(([feature, telegram, app]) => (
                <tr key={feature} className="hover:bg-zinc-900/50">
                  <td className="px-6 py-3 font-medium text-white">{feature}</td>
                  <td className="px-6 py-3 text-zinc-500">{telegram}</td>
                  <td className="px-6 py-3 text-emerald-400">{app}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: 'Is the APK safe to install?',
              a: 'Yes. The APK is signed with our official keystore and served directly from resurgo.life. It\'s a WebView wrapper around the same secure web app you already use.',
            },
            {
              q: 'Will I lose my data?',
              a: 'No. All your data lives in the cloud (Convex). Sign in with the same account and everything syncs instantly.',
            },
            {
              q: 'Why not the Play Store?',
              a: 'We\'re shipping direct-download first to move fast. A Play Store listing is planned for later. The APK auto-updates when we push new web features.',
            },
            {
              q: 'What about iPhone / iOS?',
              a: 'iOS support is on our roadmap. For now, iOS users can install the PWA from Safari (Add to Home Screen) for a similar experience.',
            },
            {
              q: 'What happens to the Telegram bot?',
              a: 'The Telegram bot will continue working during a 30-day transition period. After that, all notifications will be delivered exclusively through the Android app (and web push for desktop).',
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-4"
            >
              <summary className="cursor-pointer font-semibold text-white group-open:text-emerald-400 transition">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Safe & Secure</h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
          Your data never leaves the secure pipeline. Here&apos;s how we protect you.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              icon: '🔐',
              title: 'End-to-End Encryption',
              desc: 'All traffic between the app and our servers uses HTTPS/TLS 1.3. No cleartext, ever.',
            },
            {
              icon: '🛡️',
              title: 'Clerk Authentication',
              desc: 'Auth handled by Clerk with JWTs — your password is never stored on our servers.',
            },
            {
              icon: '📱',
              title: 'Signed APK',
              desc: 'The APK is cryptographically signed with our release keystore. Android verifies integrity on install.',
            },
            {
              icon: '🗑️',
              title: 'Delete Anytime',
              desc: 'Uninstall the app and your device data is gone. Cloud data is deletable from account settings.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex gap-4"
            >
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Requirements */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
          <h3 className="mb-4 text-xl font-bold">System Requirements</h3>
          <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-zinc-500 mb-1">Android Version</p>
              <p className="text-white font-medium">Android 8.0 (Oreo) +</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Storage</p>
              <p className="text-white font-medium">&lt; 10 MB</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Internet</p>
              <p className="text-white font-medium">Required (online-first)</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Permissions</p>
              <p className="text-white font-medium">Internet, Notifications, Vibration</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to Level Up?</h2>
        <p className="mt-4 text-zinc-400">
          Download Resurgo for Android and start building lasting habits with native push notifications and AI coaching.
        </p>
        <a
          href="/downloads/resurgo-latest.apk"
          className="mt-8 inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-500 hover:shadow-emerald-500/40 active:scale-95"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 5v6h1.17L12 13.17 9.83 11H11V5h2m2-2H9v6H5l7 7 7-7h-4V3zm4 15H5v2h14v-2z" />
          </svg>
          Download APK — Free
        </a>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Resurgo',
            operatingSystem: 'Android 8.0+',
            applicationCategory: 'LifestyleApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description: 'AI-powered habit tracker with native push notifications, goal decomposition, and gamified progress tracking.',
            downloadUrl: 'https://resurgo.life/downloads/resurgo-latest.apk',
            softwareVersion: '1.0.0',
            fileSize: '4.2MB',
            author: {
              '@type': 'Organization',
              name: 'Resurgo',
              url: 'https://resurgo.life',
            },
          }),
        }}
      />
    </main>
  );
}
