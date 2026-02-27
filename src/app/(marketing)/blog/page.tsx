import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Resurgo',
  description: 'Insights on productivity, habit science, goal achievement, and building the life you want.',
};

const POSTS = [
  {
    slug: 'habit-science-why-streaks-work',
    title: 'The Neuroscience of Habit Streaks: Why Consecutive Days Actually Matter',
    desc: "Your brain on a habit loop isn't just repetition — it's identity construction. Here's the science behind why streaks work and how to use them without the shame spiral.",
    date: 'February 12, 2026',
    readTime: '6 min',
    tags: ['habits', 'neuroscience', 'psychology'],
  },
  {
    slug: 'procrastination-is-not-laziness',
    title: 'Procrastination Is Not a Time Management Problem (And How to Actually Fix It)',
    desc: "Procrastination is an emotional regulation failure, not a discipline one. Understanding this distinction is the first step to eliminating it permanently.",
    date: 'February 8, 2026',
    readTime: '8 min',
    tags: ['procrastination', 'focus', 'psychology'],
  },
  {
    slug: 'ai-coaching-vs-human-coaching',
    title: 'AI Coaching vs Human Coaching: A Brutally Honest Comparison',
    desc: "We pitted 6 AI personas against traditional coaching approaches across accountability, cost, availability, and emotional intelligence. The results might surprise you.",
    date: 'February 3, 2026',
    readTime: '10 min',
    tags: ['AI', 'coaching', 'productivity'],
  },
  {
    slug: 'goal-tracking-systems-compared',
    title: 'SMART Goals Are Dead. Here\'s What Actually Works in 2026.',
    desc: "SMART goals were designed for organizations in the 1980s. Here's why they fail for personal achievement — and the modern frameworks that actually move the needle.",
    date: 'January 28, 2026',
    readTime: '7 min',
    tags: ['goals', 'systems', 'productivity'],
  },
  {
    slug: 'deep-work-in-the-age-of-notifications',
    title: 'Deep Work Is Becoming a Superpower (And How to Build It in 30 Days)',
    desc: "The ability to focus deeply is increasingly rare and increasingly valuable. Here's a 30-day protocol for rebuilding your attention span in the age of infinite distraction.",
    date: 'January 21, 2026',
    readTime: '9 min',
    tags: ['focus', 'deep work', 'discipline'],
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: BLOG</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Dispatches from the Grind</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              Evidence-based insights on productivity, habits, and human performance.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700 hover:bg-zinc-900">
              <div className="mb-3 flex items-center gap-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="font-mono text-[8px] tracking-widest text-orange-600 border border-orange-900/50 px-2 py-0.5">
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
              <h2 className="font-mono text-base font-bold text-zinc-100 leading-snug">{post.title}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-500 leading-relaxed">{post.desc}</p>
              <div className="mt-4 flex items-center gap-4 font-mono text-[9px] text-zinc-400">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime} read</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
