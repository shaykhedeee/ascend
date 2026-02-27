import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Developer Docs — Resurgo API',
  description: 'Complete API documentation for integrating with Resurgo.',
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-8 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: DEVELOPER_DOCS</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">API Reference</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">Build on top of Resurgo with our REST API and webhooks.</p>
          </div>
        </div>

        {/* Quickstart */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">QUICKSTART</div>
          <div className="p-5 space-y-4 font-mono text-sm">
            <div className="space-y-2">
              <p className="text-[9px] tracking-widest text-zinc-400">1. GENERATE_API_KEY</p>
              <p className="text-zinc-400">Go to Dashboard → Integrations → API Keys → Generate Key</p>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] tracking-widest text-zinc-400">2. MAKE_FIRST_REQUEST</p>
              <div className="border border-zinc-800 bg-black p-4">
                <pre className="text-xs text-green-400 overflow-x-auto">{`curl https://resurgo.life/api/v1 \\
  -H "x-api-key: rsg_your_key_here"`}</pre>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] tracking-widest text-zinc-400">3. RESPONSE</p>
              <div className="border border-zinc-800 bg-black p-4">
                <pre className="text-xs text-orange-400 overflow-x-auto">{`{
  "version": "1.0.0",
  "status": "operational",
  "endpoints": { ... }
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">ENDPOINTS</div>
          <div className="divide-y divide-zinc-900">
            {[
              { method: 'GET',  path: '/api/v1',              desc: 'API status and endpoint listing' },
              { method: 'GET',  path: '/api/v1/goals',         desc: 'List all goals for authenticated user' },
              { method: 'POST', path: '/api/v1/goals',         desc: 'Create a new goal' },
              { method: 'GET',  path: '/api/v1/habits',        desc: 'List all habits' },
              { method: 'POST', path: '/api/v1/habits/log',    desc: 'Log a habit completion' },
              { method: 'GET',  path: '/api/v1/stats',         desc: 'Get productivity statistics' },
            ].map(({ method, path, desc }) => (
              <div key={path} className="flex items-center gap-4 px-5 py-3">
                <span className={`shrink-0 border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest ${method === 'GET' ? 'border-blue-900 text-blue-400' : 'border-green-900 text-green-400'}`}>
                  {method}
                </span>
                <span className="font-mono text-xs text-zinc-300 min-w-[220px]">{path}</span>
                <span className="font-mono text-xs text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate limits */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">RATE_LIMITS</div>
          <div className="grid divide-x divide-zinc-900 grid-cols-3">
            {[
              { plan: 'FREE', limit: '0 req/hr', note: 'No API access' },
              { plan: 'PRO', limit: '100 req/hr', note: 'Default' },
              { plan: 'ENTERPRISE', limit: 'Custom', note: 'Contact us' },
            ].map(({ plan, limit, note }) => (
              <div key={plan} className="p-5 text-center">
                <p className="font-mono text-[9px] tracking-widest text-zinc-400">{plan}</p>
                <p className="mt-2 font-mono text-lg font-bold text-zinc-200">{limit}</p>
                <p className="mt-1 font-mono text-[9px] text-zinc-400">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-widest text-zinc-300">AUTHENTICATION</div>
          <div className="p-5 space-y-3 font-mono text-sm text-zinc-400">
            <p>All API requests require authentication via API key. Pass your key in the request header:</p>
            <div className="border border-zinc-800 bg-black p-4">
              <pre className="text-xs text-orange-400">{`x-api-key: rsg_your_api_key_here
# or
Authorization: Bearer rsg_your_api_key_here`}</pre>
            </div>
            <p className="text-xs text-zinc-400">
              Generate API keys from your <Link href="/integrations" className="text-orange-400 hover:underline">Integrations dashboard</Link>. 
              Keys start with <span className="text-orange-400">rsg_</span> and are shown once upon generation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
