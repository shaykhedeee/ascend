'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Wellness Page
// Mood tracking, journaling, wellness check-ins
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import {
  Heart,
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
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Heart className="h-6 w-6 text-pink-400" /> Wellness
      </h1>

      {/* Tab toggle */}
      <div className="mb-6 flex rounded-lg bg-[var(--surface)] p-1 w-fit">
        <button
          onClick={() => setTab('mood')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'mood' ? 'bg-ascend-500 text-white' : 'text-[var(--text-secondary)]'
          }`}
        >
          Mood Check-in
        </button>
        <button
          onClick={() => setTab('journal')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'journal' ? 'bg-ascend-500 text-white' : 'text-[var(--text-secondary)]'
          }`}
        >
          Journal
        </button>
      </div>

      {tab === 'mood' && (
        <div className="space-y-6">
          {/* Mood input */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              How are you feeling{todayMood ? ' now' : ' today'}?
            </h2>

            {/* Score selector */}
            <div className="mb-4 flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((score) => {
                const Icon = MOOD_ICONS[score] || Meh;
                return (
                  <button
                    key={score}
                    onClick={() => setMoodScore(score)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                      moodScore === score
                        ? 'bg-ascend-500/20 ring-2 ring-ascend-500 scale-110'
                        : 'hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${MOOD_COLORS[score]}`} />
                    <span className="text-xs text-[var(--text-secondary)]">{MOOD_LABELS[score]}</span>
                  </button>
                );
              })}
            </div>

            {/* Tags */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">How would you describe it?</p>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      moodTags.includes(tag)
                        ? 'bg-ascend-500 text-white'
                        : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <textarea
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              placeholder="Any notes about how you're feeling? (optional)"
              className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-ascend-500 focus:outline-none resize-none"
              rows={3}
            />

            <button
              onClick={handleMoodSubmit}
              disabled={moodSaving}
              className="rounded-lg bg-ascend-500 px-6 py-2 text-sm font-medium text-white hover:bg-ascend-600 disabled:opacity-50"
            >
              {todayMood ? 'Update Mood' : 'Log Mood'}
            </button>
          </div>

          {/* Mood history */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Recent Moods</h2>
            {!moodHistory || moodHistory.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">No mood entries yet</p>
            ) : (
              <div className="space-y-3">
                {moodHistory.slice(0, 14).map((entry) => {
                  const Icon = MOOD_ICONS[entry.score] || Meh;
                  return (
                    <div key={entry._id} className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${MOOD_COLORS[entry.score]}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {MOOD_LABELS[entry.score]}
                          </span>
                          {entry.tags?.map((tag) => (
                            <span key={tag} className="rounded-full bg-[var(--background)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">
                              {tag}
                            </span>
                          ))}
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{entry.notes}</p>
                        )}
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
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

      {tab === 'journal' && (
        <div className="space-y-6">
          {/* New entry button / form */}
          {!showJournalForm ? (
            <button
              onClick={() => setShowJournalForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)] hover:border-ascend-500 hover:text-ascend-400 transition-colors"
            >
              <Plus className="h-4 w-4" /> New Journal Entry
            </button>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)] flex items-center gap-1">
                <BookOpen className="h-5 w-5" /> New Entry
              </h2>

              {/* Type selector */}
              <div className="mb-4 flex flex-wrap gap-2">
                {JOURNAL_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setJournalType(t.id as typeof journalType)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      journalType === t.id
                        ? 'bg-ascend-500 text-white'
                        : 'bg-[var(--background)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder={
                  journalType === 'gratitude'
                    ? 'What are you grateful for today?'
                    : journalType === 'reflection'
                      ? 'Reflect on your day...'
                      : 'Write your thoughts...'
                }
                className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-ascend-500 focus:outline-none resize-none"
                rows={6}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleJournalSubmit}
                  disabled={!journalContent.trim() || journalSaving}
                  className="rounded-lg bg-ascend-500 px-6 py-2 text-sm font-medium text-white hover:bg-ascend-600 disabled:opacity-50"
                >
                  Save Entry
                </button>
                <button
                  onClick={() => { setShowJournalForm(false); setJournalContent(''); }}
                  className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Journal entries list */}
          <div className="space-y-3">
            {!journalEntries || journalEntries.length === 0 ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-[var(--text-secondary)]" />
                <p className="text-sm text-[var(--text-secondary)]">No journal entries yet. Start writing!</p>
              </div>
            ) : (
              journalEntries.map((entry) => (
                <div key={entry._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      entry.type === 'gratitude' ? 'bg-green-500/20 text-green-400' :
                      entry.type === 'reflection' ? 'bg-blue-500/20 text-blue-400' :
                      entry.type === 'goal_note' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {entry.type ?? 'freeform'}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">{entry.date}</span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
