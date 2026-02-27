'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FormEvent, useMemo, useState } from 'react';
import { Send } from 'lucide-react';

export default function CoachPage() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const history = useQuery(api.coachMessages.getHistory, { limit: 50 });
  const sendWithAutoReply = useMutation(api.coachMessages.sendWithAutoReply);

  const sortedMessages = useMemo(() => history ?? [], [history]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;

    setIsSending(true);
    try {
      await sendWithAutoReply({
        content: text,
        touchpoint: 'on_demand',
      });
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">

        {/* ── COMMS HEADER ── */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">
              COMMS :: AI_COACH_INTERFACE
            </span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">AI_COMMS</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-600">
              ASK_FOR_PLANNING &gt; HABIT_REINFORCEMENT &gt; WEEKLY_CHECKIN
            </p>
          </div>
        </div>

        {/* ── CHAT PANEL ── */}
        <div className="border border-zinc-900 bg-zinc-950">
          {/* Message thread */}
          <div className="max-h-[60vh] space-y-px overflow-y-auto p-1">
            {sortedMessages.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-mono text-xs tracking-widest text-zinc-600">NO_TRANSMISSIONS_YET</p>
                <p className="mt-3 font-mono text-[10px] text-zinc-700">
                  Try: &ldquo;Plan my top 3 priorities for today&rdquo; or &ldquo;I feel stuck, give me a tiny next step.&rdquo;
                </p>
              </div>
            )}

            {sortedMessages.map((m) => (
              <div
                key={m._id}
                className={`border px-4 py-3 transition ${
                  m.role === 'coach'
                    ? 'mr-8 border-orange-900 bg-orange-950/10'
                    : 'ml-8 border-zinc-800 bg-zinc-950'
                }`}
              >
                <p className={`mb-1 font-mono text-[9px] tracking-widest ${
                  m.role === 'coach' ? 'text-orange-600' : 'text-zinc-600'
                }`}>
                  {m.role === 'coach' ? 'AI_COACH' : 'OPERATOR'}
                </p>
                <p className="font-mono text-xs leading-relaxed text-zinc-300">{m.content}</p>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-zinc-900 p-3"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ENTER_TRANSMISSION..."
              className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-700 focus:border-orange-800 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="flex h-9 items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-4 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3 w-3" />
              {isSending ? 'SENDING_' : '[TRANSMIT]'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
