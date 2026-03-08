export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-zinc-100">
      <div className="max-w-xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.45)]">
        <p className="font-pixel text-[0.55rem] tracking-[0.3em] text-orange-500">OFFLINE_MODE</p>
        <h1 className="mt-4 font-mono text-3xl font-bold">You&rsquo;re still in control.</h1>
        <p className="mt-4 font-mono text-sm leading-6 text-zinc-400">
          Resurgo can keep capturing tasks and brain dumps without Wi-Fi. Any drafts you save offline
          will sync automatically the moment your connection comes back.
        </p>
        <div className="mt-6 grid gap-3 text-left font-mono text-xs text-zinc-400 sm:grid-cols-2">
          <div className="border border-zinc-800 bg-black p-3">
            <p className="text-orange-500">TASK_CAPTURE</p>
            <p className="mt-2">Queue new tasks locally and review them from the Tasks page.</p>
          </div>
          <div className="border border-zinc-800 bg-black p-3">
            <p className="text-orange-500">BRAIN_DUMPS</p>
            <p className="mt-2">Save raw dumps now. AI parsing and journaling resume automatically online.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
