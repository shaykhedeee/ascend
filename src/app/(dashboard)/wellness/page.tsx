'use client';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RESURGO â€” Wellness Page
// Mood tracking, journaling, wellness check-ins
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import {
  BookOpen,
  Smile,
  Meh,
  Frown,
  Plus,
  Calendar,
} from 'lucide-react';

const MOOD_LABELS = ['', 'Very Low', 'Low', 'Okay', 'Good', 'Great'];
const MOOD_COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];
const MOOD_ICONS = [null, Frown, Frown, Meh, Smile, Smile];

const MOOD_TAGS = [
  'Stressed', 'Anxious', 'Calm', 'Energetic', 'Tired',
  'Focused', 'Social', 'Lonely', 'Motivated', 'Grateful',
];

const JOURNAL_TYPES = [
  { id: 'reflection', label: 'Reflection' },
  { id: 'gratitude', label: 'Gratitude' },
  { id: 'goal_note', label: 'Goal Note' },
  { id: 'freeform', label: 'Freeform' },
] as const;

export default function WellnessPage() {
  const logMood = useMutation(api.wellness.logMood);
  const createJournal = useMutation(api.wellness.createJournalEntry);
  const moodHistory = useQuery(api.wellness.getMoodHistory, { days: 30 });
  const journalEntries = useQuery(api.wellness.getJournalEntries, { limit: 20 });

  const [tab, setTab] = useState<'mood' | 'journal'>('mood');

  // Mood form
  const today = new Date().toISOString().split('T')[0];
  const [moodScore, setMoodScore] = useState(3);
  const [moodNotes, setMoodNotes] = useState('');
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [moodSaving, setMoodSaving] = useState(false);

  // Journal form
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalContent, setJournalContent] = useState('');
  const [journalType, setJournalType] = useState<'reflection' | 'gratitude' | 'goal_note' | 'freeform'>('freeform');
  const [journalSaving, setJournalSaving] = useState(false);

  const todayMood = moodHistory?.find((m) => m.date === today);

  const handleMoodSubmit = async () => {
    if (moodSaving) return;
    setMoodSaving(true);
    try {
      await logMood({
        date: today,
        score: moodScore,
        notes: moodNotes || undefined,
        tags: moodTags.length > 0 ? moodTags : undefined,
      });
      setMoodNotes('');
      setMoodTags([]);
    } catch (e) {
      console.error('Failed to log mood:', e);
    }
    setMoodSaving(false);
  };

  const handleJournalSubmit = async () => {
    if (!journalContent.trim() || journalSaving) return;
    setJournalSaving(true);
    try {
      await createJournal({
        date: today,
        content: journalContent,
        type: journalType,
      });
      setJournalContent('');
      setShowJournalForm(false);
    } catch (e) {
      console.error('Failed to save journal:', e);
    }
    setJournalSaving(false);
  };

  const toggleTag = (tag: string) => {
    setMoodTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">

        {/* ── BIOMETRICS HEADER ── */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">
              BIOMETRICS :: WELLNESS_TRACKING
            </span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">BIOMETRICS</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-600">
              MOOD_TRACKING :: JOURNALING :: MENTAL_HEALTH_SUPPORT
            </p>
          </div>
          {/* Tab strip */}
          <div className="flex border-t border-zinc-900">
            {(['mood', 'journal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 border-b-2 px-4 py-2.5 font-mono text-[10px] tracking-widest transition ${
                  tab === t
                    ? 'border-orange-600 bg-orange-950/10 text-orange-500'
                    : 'border-transparent text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {t === 'mood' ? 'MOOD_CHECKIN' : 'JOURNAL'}
              </button>
            ))}
          </div>
        </div>

        {/* ── MOOD TAB ── */}
        {tab === 'mood' && (
          <div className="space-y-4">
            {/* Mood input panel */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">
                  {todayMood ? 'UPDATE_TODAY_MOOD' : 'LOG_TODAY_MOOD'}
                </span>
              </div>
              <div className="p-4">
                {/* Score selectors */}
                <p className="mb-3 font-mono text-[9px] tracking-widest text-zinc-600">SCORE_SELECTION</p>
                <div className="mb-4 flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const Icon = MOOD_ICONS[score] || Meh;
                    return (
                      <button
                        key={score}
                        onClick={() => setMoodScore(score)}
                        className={`flex flex-1 flex-col items-center gap-1 border py-3 transition ${
                          moodScore === score
                            ? 'border-orange-800 bg-orange-950/30 text-orange-500'
                            : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${MOOD_COLORS[score]}`} />
                        <span className="font-mono text-[8px] tracking-widest">
                          {MOOD_LABELS[score].toUpperCase().replace(' ', '_')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Tags */}
                <p className="mb-2 font-mono text-[9px] tracking-widest text-zinc-600">QUALIFIER_TAGS</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {MOOD_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`border px-2.5 py-1 font-mono text-[9px] tracking-widest transition ${
                        moodTags.includes(tag)
                          ? 'border-orange-800 bg-orange-950/30 text-orange-500'
                          : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                      }`}
                    >
                      {tag.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Notes */}
                <textarea
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  placeholder="OPTIONAL_NOTES..."
                  className="mb-4 w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-700 focus:border-orange-800 focus:outline-none"
                  rows={3}
                />

                <button
                  onClick={handleMoodSubmit}
                  disabled={moodSaving}
                  className="border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40"
                >
                  {todayMood ? '[UPDATE_MOOD]' : '[LOG_MOOD]'}
                </button>
              </div>
            </div>

            {/* Mood history */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">MOOD_LOG_HISTORY</span>
              </div>
              {!moodHistory || moodHistory.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-mono text-[10px] tracking-widest text-zinc-700">NO_ENTRIES_YET</p>
                </div>
              ) : (
                <div className="space-y-px p-1">
                  {moodHistory.slice(0, 14).map((entry) => {
                    const Icon = MOOD_ICONS[entry.score] || Meh;
                    return (
                      <div key={entry._id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-zinc-900">
                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${MOOD_COLORS[entry.score]}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-xs text-zinc-300">
                              {MOOD_LABELS[entry.score].toUpperCase().replace(' ', '_')}
                            </span>
                            {entry.tags?.map((tag) => (
                              <span key={tag} className="border border-zinc-800 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-zinc-600">
                                {tag.toUpperCase()}
                              </span>
                            ))}
                          </div>
                          {entry.notes && (
                            <p className="mt-0.5 font-mono text-[10px] text-zinc-600">{entry.notes}</p>
                          )}
                        </div>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-[9px] text-zinc-700">
                          <Calendar className="h-3 w-3" />
                          {entry.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── JOURNAL TAB ── */}
        {tab === 'journal' && (
          <div className="space-y-4">
            {/* New entry toggle */}
            {!showJournalForm ? (
              <button
                onClick={() => setShowJournalForm(true)}
                className="flex w-full items-center justify-center gap-2 border border-dashed border-zinc-800 bg-zinc-950 py-4 font-mono text-[10px] tracking-widest text-zinc-600 transition hover:border-orange-800 hover:text-orange-600"
              >
                <Plus className="h-3 w-3" /> [NEW_ENTRY]
              </button>
            ) : (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
                  <BookOpen className="h-3 w-3 text-zinc-600" />
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">NEW_JOURNAL_ENTRY</span>
                </div>
                <div className="p-4">
                  {/* Type selector */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {JOURNAL_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setJournalType(t.id as typeof journalType)}
                        className={`border px-3 py-1.5 font-mono text-[9px] tracking-widest transition ${
                          journalType === t.id
                            ? 'border-orange-800 bg-orange-950/30 text-orange-500'
                            : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'
                        }`}
                      >
                        {t.label.toUpperCase().replace(' ', '_')}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    placeholder={
                      journalType === 'gratitude'
                        ? 'WHAT_ARE_YOU_GRATEFUL_FOR_TODAY...'
                        : journalType === 'reflection'
                          ? 'REFLECT_ON_YOUR_DAY...'
                          : 'WRITE_YOUR_THOUGHTS...'
                    }
                    className="mb-4 w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-700 focus:border-orange-800 focus:outline-none"
                    rows={6}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleJournalSubmit}
                      disabled={!journalContent.trim() || journalSaving}
                      className="border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40"
                    >
                      [SAVE_ENTRY]
                    </button>
                    <button
                      onClick={() => { setShowJournalForm(false); setJournalContent(''); }}
                      className="border border-zinc-800 px-4 py-2 font-mono text-[10px] tracking-widest text-zinc-600 transition hover:border-zinc-700 hover:text-zinc-400"
                    >
                      [CANCEL]
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Journal entries */}
            {!journalEntries || journalEntries.length === 0 ? (
              <div className="border border-zinc-900 bg-zinc-950 py-12 text-center">
                <BookOpen className="mx-auto mb-3 h-6 w-6 text-zinc-700" />
                <p className="font-mono text-[10px] tracking-widest text-zinc-700">NO_ENTRIES_YET</p>
              </div>
            ) : (
              <div className="space-y-px">
                {journalEntries.map((entry) => (
                  <div key={entry._id} className="border border-zinc-900 bg-zinc-950 p-4 transition hover:bg-zinc-900">
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`border px-2 py-0.5 font-mono text-[9px] tracking-widest ${
                        entry.type === 'gratitude'  ? 'border-green-900 text-green-600' :
                        entry.type === 'reflection' ? 'border-blue-900 text-blue-600' :
                        entry.type === 'goal_note'  ? 'border-purple-900 text-purple-600' :
                        'border-zinc-800 text-zinc-600'
                      }`}>
                        {(entry.type ?? 'freeform').toUpperCase().replace('_', '_')}
                      </span>
                      <span className="font-mono text-[9px] text-zinc-700">{entry.date}</span>
                    </div>
                    <p className="font-mono text-xs leading-relaxed text-zinc-400 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
