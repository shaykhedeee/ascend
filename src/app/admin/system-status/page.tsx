import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const readinessChecks = [
  {
    label: 'Offline queue',
    status: 'ready',
    detail: 'Tasks and brain dumps can now be queued locally and synced when connectivity returns.',
  },
  {
    label: 'Research mode',
    status: 'needs_key',
    detail: 'Server route is wired for Brave Search. Add BRAVE_SEARCH_API_KEY to activate live citations.',
  },
  {
    label: 'Windows packaging',
    status: 'planned',
    detail: 'PWA path is aligned. Tauri signing and updater wiring remain a release-track task.',
  },
  {
    label: 'Android packaging',
    status: 'ready',
    detail: 'Android APK flow remains available via the existing release artifact path.',
  },
];

function statusClasses(status: string) {
  switch (status) {
    case 'ready':
      return 'border-emerald-900 bg-emerald-950/20 text-emerald-300';
    case 'needs_key':
      return 'border-amber-900 bg-amber-950/20 text-amber-300';
    default:
      return 'border-zinc-800 bg-zinc-950 text-zinc-300';
  }
}

export default async function AdminSystemStatusPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in?redirect_url=/admin/system-status');
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/health`, { cache: 'no-store' }).catch(() => null);
  const health = response?.ok ? await response.json() : null;

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="font-mono text-xs tracking-[0.3em] text-orange-500">ADMIN_SYSTEM_STATUS</p>
          <h1 className="mt-3 font-mono text-3xl font-bold">Launch readiness snapshot</h1>
          <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
            A quick operational view for the platform promises that matter most right now: offline capture,
            researcher mode, packaging readiness, and health monitoring.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="border border-zinc-800 bg-zinc-950 p-5">
            <p className="font-mono text-xs tracking-widest text-zinc-500">SERVICE</p>
            <p className="mt-2 font-mono text-2xl font-bold text-zinc-100">{health?.status ?? 'unknown'}</p>
            <p className="mt-2 font-mono text-xs text-zinc-500">{health?.service ?? 'resurgo'}</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-5">
            <p className="font-mono text-xs tracking-widest text-zinc-500">VERSION</p>
            <p className="mt-2 font-mono text-2xl font-bold text-zinc-100">{health?.version ?? 'n/a'}</p>
            <p className="mt-2 font-mono text-xs text-zinc-500">app build tag</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-5">
            <p className="font-mono text-xs tracking-widest text-zinc-500">ENV</p>
            <p className="mt-2 font-mono text-2xl font-bold text-zinc-100">{health?.environment ?? 'unknown'}</p>
            <p className="mt-2 font-mono text-xs text-zinc-500">runtime environment</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-5">
            <p className="font-mono text-xs tracking-widest text-zinc-500">TIMESTAMP</p>
            <p className="mt-2 font-mono text-sm font-bold text-zinc-100">{health?.timestamp ?? 'n/a'}</p>
            <p className="mt-2 font-mono text-xs text-zinc-500">latest health report</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {readinessChecks.map((check) => (
            <article key={check.label} className={`border p-5 ${statusClasses(check.status)}`}>
              <p className="font-mono text-xs tracking-widest opacity-80">{check.label.toUpperCase()}</p>
              <p className="mt-3 font-mono text-sm leading-6">{check.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
