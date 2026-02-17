'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Focus Timer Page
// Pomodoro & Deep Work focus sessions with distraction tracking
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  Play,
  Pause,
  Square,
  RotateCcw,
  AlertTriangle,
  Trophy,
  Clock,
  Zap,
} from 'lucide-react';

const FOCUS_METHODS = [
  { id: 'pomodoro' as const, label: 'Pomodoro 25/5', work: 25, breakMin: 5 },
  { id: 'pomodoro' as const, label: 'Pomodoro 50/10', work: 50, breakMin: 10 },
  { id: 'deep_work' as const, label: 'Deep Work 90', work: 90, breakMin: 15 },
  { id: 'flowtime' as const, label: 'Flowtime', work: 0, breakMin: 0 },
  { id: 'custom' as const, label: 'Custom', work: 0, breakMin: 0 },
];

type FocusState = 'idle' | 'working' | 'break' | 'paused';

export default function FocusPage() {
  const startSession = useMutation(api.focusSessions.start);
  const completeSession = useMutation(api.focusSessions.complete);
  const cancelSession = useMutation(api.focusSessions.cancel);
  const logDistraction = useMutation(api.focusSessions.logDistraction);
  const todaySessions = useQuery(api.focusSessions.today);
  const stats = useQuery(api.focusSessions.getStats, {});

  const [methodIdx, setMethodIdx] = useState(0);
  const method = FOCUS_METHODS[methodIdx];
  const [customMinutes, setCustomMinutes] = useState(25);
  const [state, setState] = useState<FocusState>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [distractionCount, setDistractionCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Timer tick
  useEffect(() => {
    if (state === 'working' || state === 'break') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            if (state === 'working') {
              // Session complete
              handleComplete();
            } else {
              setState('idle');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return clearTimer;
  }, [state, clearTimer]);

  const handleStart = async () => {
    const workMinutes = method.id === 'custom' ? customMinutes : method.work;
    if (workMinutes <= 0 && method.id !== 'flowtime') return;

    const flowtime = method.id === 'flowtime';
    const duration = flowtime ? 60 : workMinutes; // Flowtime: count up for 60 min max

    try {
      const id = await startSession({
        type: method.id,
        durationMinutes: duration,
      });
      setSessionId(id);
      setSecondsLeft(duration * 60);
      setTotalSeconds(duration * 60);
      setDistractionCount(0);
      setState('working');
    } catch (e) {
      console.error('Failed to start session:', e);
    }
  };

  const handleComplete = async () => {
    clearTimer();
    if (sessionId) {
      try {
        await completeSession({ sessionId: sessionId as never });
      } catch (e) {
        console.error('Failed to complete session:', e);
      }
    }
    setState('idle');
    setSessionId(null);

    // Start break
    if (method.breakMin > 0) {
      setSecondsLeft(method.breakMin * 60);
      setTotalSeconds(method.breakMin * 60);
      setState('break');
    }
  };

  const handleCancel = async () => {
    clearTimer();
    if (sessionId) {
      try {
        await cancelSession({ sessionId: sessionId as never });
      } catch (e) {
        console.error('Failed to cancel session:', e);
      }
    }
    setState('idle');
    setSessionId(null);
    setSecondsLeft(0);
  };

  const handlePause = () => {
    clearTimer();
    setState('paused');
  };

  const handleResume = () => {
    setState('working');
  };

  const handleDistraction = async () => {
    setDistractionCount(prev => prev + 1);
    if (sessionId) {
      try {
        await logDistraction({
          sessionId: sessionId as never,
          description: 'Distraction logged',
        });
      } catch (e) {
        console.error('Failed to log distraction:', e);
      }
    }
  };

  const isActive = state === 'working' || state === 'break' || state === 'paused';

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Timer className="h-6 w-6 text-orange-400" /> Focus Mode
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Method selector */}
          {!isActive && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {FOCUS_METHODS.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => setMethodIdx(i)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    methodIdx === i
                      ? 'bg-ascend-500 text-white'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}

          {/* Custom duration */}
          {!isActive && method.id === 'custom' && (
            <div className="mb-6 flex items-center gap-2">
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
              />
              <span className="text-sm text-[var(--text-secondary)]">minutes</span>
            </div>
          )}

          {/* Timer Display */}
          <div className="relative mb-8 flex h-64 w-64 items-center justify-center">
            {/* Progress ring */}
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="120" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                cx="128" cy="128" r="120" fill="none"
                stroke={state === 'break' ? '#22c55e' : '#F97316'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>

            <div className="text-center z-10">
              <p className="text-5xl font-bold text-[var(--text-primary)] font-mono">
                {isActive ? formatTime(secondsLeft) : formatTime((method.id === 'custom' ? customMinutes : method.work) * 60)}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)] capitalize">
                {state === 'idle' ? 'Ready' : state === 'break' ? 'Break Time' : state === 'paused' ? 'Paused' : 'Focusing'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {state === 'idle' && (
              <button
                onClick={handleStart}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-ascend-500 text-white shadow-lg hover:bg-ascend-600 transition-colors"
              >
                <Play className="h-6 w-6 ml-0.5" />
              </button>
            )}
            {state === 'working' && (
              <>
                <button
                  onClick={handlePause}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-hover)]"
                >
                  <Pause className="h-6 w-6" />
                </button>
                <button
                  onClick={handleComplete}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
                >
                  <Square className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDistraction}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  title="Log distraction"
                >
                  <AlertTriangle className="h-4 w-4" />
                </button>
              </>
            )}
            {state === 'paused' && (
              <>
                <button
                  onClick={handleResume}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-ascend-500 text-white"
                >
                  <Play className="h-6 w-6 ml-0.5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            )}
            {state === 'break' && (
              <button
                onClick={() => { clearTimer(); setState('idle'); }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Distraction counter */}
          {isActive && distractionCount > 0 && (
            <p className="mt-4 text-xs text-red-400">
              {distractionCount} distraction{distractionCount !== 1 ? 's' : ''} logged
            </p>
          )}
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          {/* Today's sessions */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Today&apos;s Sessions</h3>
            {!todaySessions || todaySessions.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)]">No sessions today yet</p>
            ) : (
              <div className="space-y-2">
                {todaySessions.map((s) => (
                  <div key={s._id} className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">{s.type.replace('_', ' ')}</span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {s.actualDuration ?? s.duration} min
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overall stats */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Clock className="h-3 w-3" /> Total Sessions
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {stats?.totalSessions ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Zap className="h-3 w-3" /> Total Minutes
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {stats?.totalMinutes ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Trophy className="h-3 w-3" /> Avg Focus Score
                </span>
                <span className="text-sm font-bold text-ascend-500">
                  {stats?.avgFocusScore ?? '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
