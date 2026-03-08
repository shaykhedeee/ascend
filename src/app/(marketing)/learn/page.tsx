import type { Metadata } from 'next';
import { getAllLearnTerms } from '@/lib/marketing/learn';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'Learn — Productivity Glossary | RESURGO',
  description: 'Learn productivity and habit-building concepts through practical, plain-language explainers linked to real execution.',
  alternates: { canonical: '/learn' },
};

export default async function LearnIndexPage() {
  const pages = await getAllLearnTerms();
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">Learn</h1>
        <p className="mt-3 font-mono text-sm text-zinc-400">Glossary pages for informational search intent.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <article key={page.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="font-mono text-base font-semibold text-zinc-100">What is {page.term}?</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{page.definition}</p>
              <TermLinkButton href={`/learn/${page.slug}`} variant="secondary" size="sm" className="mt-4">
                READ_ARTICLE
              </TermLinkButton>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
