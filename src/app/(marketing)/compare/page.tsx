import type { Metadata } from 'next';
import { getAllComparisons } from '@/lib/marketing/compare';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'RESURGO Comparisons — Resurgo vs Alternatives',
  description: 'Compare RESURGO with other productivity and habit tools to choose the best fit for your workflow.',
  alternates: { canonical: '/compare' },
};

export default async function CompareIndexPage() {
  const pages = await getAllComparisons();
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">RESURGO vs Alternatives</h1>
        <p className="mt-3 font-mono text-sm text-zinc-400">Decision pages for high-intent comparison traffic.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <article key={page.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="font-mono text-base font-semibold text-zinc-100">RESURGO vs {page.competitor}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{page.summary}</p>
              <TermLinkButton href={`/compare/${page.slug}`} variant="secondary" size="sm" className="mt-4">
                VIEW_COMPARISON
              </TermLinkButton>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
