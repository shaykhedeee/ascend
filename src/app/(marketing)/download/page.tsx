import type { Metadata } from 'next';
import Link from 'next/link';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'Install Resurgo - PWA and Android access',
  description:
    'Install Resurgo on mobile or desktop in seconds. Use the PWA on any device, or grab the latest Android package when a release is published.',
  keywords: [
    'Resurgo install', 'Resurgo app', 'productivity PWA', 'add to home screen',
    'AI productivity app mobile', 'progressive web app planner',
  ],
  alternates: { canonical: '/download' },
  openGraph: {
    title: 'Install Resurgo - PWA and Android access',
    description: 'Add Resurgo to your home screen in seconds. Works on Android, iPhone, desktop, and tablet.',
    type: 'website',
    url: '/download',
  },
};

const FEATURES = [
  {
    title: 'Fast launch',
    description: 'Open Resurgo from your home screen or desktop dock without dealing with browser tabs every time.',
  },
  {
    title: 'Offline-friendly',
    description: 'Installed sessions cache key screens and queue supported actions until your connection returns.',
  },
  {
    title: 'Full dashboard access',
    description: 'Use the same habits, tasks, goals, reviews, and AI planning workflows you see on the web app.',
  },
  {
    title: 'Secure account sync',
    description: 'Sign in once and your data stays synced across devices through the same Resurgo account.',
  },
  {
    title: 'No app store required',
    description: 'The PWA installs directly from the browser on desktop, Android, iPhone, and iPad.',
  },
  {
    title: 'Android package option',
    description: 'If you prefer a packaged install, use the latest Android release when one has been published.',
  },
];

const INSTALL_ANDROID = [
  { step: 1, title: 'Open resurgo.life in Chrome', description: 'Use Chrome or Samsung Internet on your Android device.' },
  { step: 2, title: 'Tap the menu (...) then "Add to Home screen"', description: 'If Chrome shows an install button in the address bar, you can use that too.' },
  { step: 3, title: 'Tap "Add"', description: 'Android adds the Resurgo icon to your home screen instantly.' },
  { step: 4, title: 'Launch & allow notifications', description: 'Open Resurgo from your home screen and allow push notifications when prompted.' },
];

const INSTALL_IOS = [
  { step: 1, title: 'Open resurgo.life in Safari', description: 'Use Safari on iPhone or iPad for installation.' },
  { step: 2, title: 'Tap the Share button', description: 'You will find it in Safari\'s toolbar.' },
  { step: 3, title: 'Tap "Add to Home Screen"', description: 'Scroll down the share sheet if needed.' },
  { step: 4, title: 'Tap "Add"', description: 'Safari adds Resurgo to your home screen like a native app.' },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* ─── APK + Install Hero ─── */}
      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-20">
          <div className="mb-4 font-mono text-xs tracking-widest text-orange-400">
            GET_RESURGO :: PWA + OPTIONAL_ANDROID_PACKAGE
          </div>
          <h1 className="font-mono text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">
            Download Resurgo
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-zinc-400">
            The fastest path is the browser install. Add Resurgo to your home screen or desktop, then sign in and pick up exactly where you left off.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TermLinkButton
              href="https://github.com/ShaykhedeE/ascend/releases/latest/download/resurgo.apk"
              variant="primary"
              size="lg"
            >
              DOWNLOAD ANDROID PACKAGE
            </TermLinkButton>
            <TermLinkButton href="/sign-up" variant="secondary" size="lg">
              INSTALL VIA BROWSER
            </TermLinkButton>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-zinc-600">
            <span>PWA on desktop + mobile</span>
            <span>Android package link available</span>
            <span>Uses your live cloud account</span>
          </div>
          <div className="mt-5 max-w-xl border border-yellow-900/40 bg-yellow-950/10 px-4 py-3">
            <p className="font-mono text-xs leading-relaxed text-yellow-400">
              <strong>Android package note:</strong> If you install the APK, Android may ask you to allow installs from your browser or file manager because it is outside the Play Store.
            </p>
          </div>
          <h2 className="mt-10 font-mono text-xl text-zinc-400">Or install as a home screen app on any device</h2>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            No app store needed - works on iPhone, iPad, Android, and modern desktop browsers.
          </p>
        </div>
      </section>

      {/* Install Steps: Android + iOS */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2 font-mono text-2xl font-bold text-zinc-100">How to Install</h2>
        <p className="mb-12 font-mono text-sm text-zinc-400">
          Pick your device and follow the steps. Takes under 30 seconds.
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Android */}
          <div className="border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-orange-400">ANDROID_/_CHROME</span>
              <span className="text-xs text-zinc-600">(also Samsung Internet, Edge)</span>
            </div>
            <ol className="space-y-5">
              {INSTALL_ANDROID.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-orange-800 bg-orange-950/30 font-mono text-xs text-orange-400">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold text-zinc-200">{s.title}</p>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500 leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* iOS */}
          <div className="border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-blue-400">IPHONE_/_IPAD_SAFARI</span>
            </div>
            <ol className="space-y-5">
              {INSTALL_IOS.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-blue-800 bg-blue-950/30 font-mono text-xs text-blue-400">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold text-zinc-200">{s.title}</p>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500 leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-mono text-xs text-zinc-600">
              Note: iOS 16.4+ supports push notifications for PWAs in Safari.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-zinc-900 mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2 font-mono text-2xl font-bold text-zinc-100">What You Get</h2>
        <p className="mb-12 font-mono text-sm text-zinc-400">Everything the web app offers, delivered in an installable format.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="font-mono text-sm font-semibold text-zinc-200 mb-1">{f.title}</h3>
              <p className="font-mono text-xs text-zinc-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-900 mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-8 font-mono text-2xl font-bold text-zinc-100">FAQ</h2>
        <div className="space-y-1">
          {[
            {
              q: 'Do I need to create an account?',
              a: 'Yes. Sign up free at resurgo.life - it takes about 30 seconds. Your data is stored in the cloud and syncs across all your devices.',
            },
            {
              q: 'Is this a real app or just a bookmark?',
              a: 'It is a Progressive Web App. Installed PWAs launch in a standalone window, keep their own icon, support notifications on supported platforms, and feel close to a native app for most daily use.',
            },
            {
              q: 'Why not the Play Store or App Store?',
              a: 'The PWA installs instantly, updates faster, and avoids store review delays. It is the fastest way for most users to get the full Resurgo experience.',
            },
            {
              q: 'Does it work on desktop?',
              a: 'Yes. Chrome and Edge on Windows, macOS, and Linux support installation. Use the browser install prompt or the install option in the browser menu.',
            },
            {
              q: 'Will I lose my data if I uninstall the PWA?',
              a: 'No. All your data lives in Convex (cloud). Uninstalling the PWA only removes the app icon. Log back in on any device or browser and everything is there.',
            },
            {
              q: 'Does Telegram integration still work?',
              a: 'Yes. Telegram remains available for quick habit check-ins, daily nudges, and coaching messages. The PWA handles the full interactive experience; Telegram handles quick on-the-go interactions.',
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group border border-zinc-800 bg-zinc-950"
            >
              <summary className="cursor-pointer px-5 py-4 font-mono text-sm font-semibold text-zinc-200 group-open:text-orange-400 transition">
                {faq.q}
              </summary>
              <p className="px-5 pb-4 font-mono text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-900 mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs tracking-widest text-orange-400 mb-3">READY_TO_BEGIN</p>
        <h2 className="font-mono text-3xl font-bold text-zinc-100">Start building better habits today.</h2>
        <p className="mt-3 font-mono text-sm text-zinc-400 max-w-md mx-auto">
          Open resurgo.life in your browser, sign up free, then install it to your home screen or desktop.
        </p>
        <Link
          href="/sign-up"
          className="mt-8 inline-block border border-orange-800 bg-orange-950/30 px-8 py-3 font-mono text-sm tracking-widest text-orange-400 transition hover:bg-orange-950/60"
        >
          [GET_STARTED_FREE]
        </Link>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Resurgo',
            operatingSystem: 'Android, iOS, Windows, macOS, Linux',
            applicationCategory: 'LifestyleApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description: 'AI-powered productivity assistant with planning, habits, tasks, coaching, and installable PWA access on any device.',
            url: 'https://resurgo.life',
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

