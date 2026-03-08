import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const CONTENT_SURFACES = [
  { route: '/', title: 'Homepage', focus: 'Positioning, hero, proof, conversion' },
  { route: '/templates', title: 'Template Library', focus: 'SEO, template breadth, launch paths' },
  { route: '/guides', title: 'Guides Hub', focus: 'Evergreen education and search traffic' },
  { route: '/download', title: 'Download Page', focus: 'PWA, Android APK, Windows readiness messaging' },
  { route: '/support', title: 'Support', focus: 'Offline expectations and troubleshooting' },
];

const SYSTEM_NOTES = [
  'Offline queue now captures tasks and brain dumps locally before sync.',
  'Research mode is ready for Brave Search once BRAVE_SEARCH_API_KEY is set server-side.',
  'Marketing metadata has been repositioned around AI productivity assistance instead of only habit tracking.',
  'Templates, guides, and download messaging should stay aligned with real platform capabilities.',
];

export default async function AdminContentPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in?redirect_url=/admin/content');
  }

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="font-mono text-xs tracking-[0.3em] text-orange-500">ADMIN_CONTENT</p>
          <h1 className="mt-3 font-mono text-3xl font-bold">Content control room</h1>
          <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
            Quick overview of the public surfaces that need consistent positioning, honest platform claims,
            and launch-ready messaging.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {CONTENT_SURFACES.map((surface) => (
            <article key={surface.route} className="border border-zinc-800 bg-zinc-950 p-5">
              <p className="font-mono text-xs tracking-widest text-orange-500">{surface.route}</p>
              <h2 className="mt-2 font-mono text-lg font-semibold text-zinc-100">{surface.title}</h2>
              <p className="mt-2 font-mono text-sm text-zinc-400">{surface.focus}</p>
              <Link
                href={surface.route}
                className="mt-4 inline-flex border border-zinc-700 px-3 py-2 font-mono text-xs tracking-widest text-zinc-300 hover:border-orange-700 hover:text-orange-400"
              >
                OPEN_SURFACE
              </Link>
            </article>
          ))}
        </section>

        <section className="border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-semibold tracking-widest text-zinc-100">CURRENT_NOTES</h2>
          <ul className="mt-4 space-y-3 font-mono text-sm text-zinc-400">
            {SYSTEM_NOTES.map((note) => (
              <li key={note} className="border border-zinc-900 bg-black/40 px-3 py-3">
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
