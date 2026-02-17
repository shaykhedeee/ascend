'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Calendar Page
// Monthly calendar view with habit/task completion overlays
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, CheckCircle2, Circle } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Date range for this month view
  const startDate = useMemo(() => {
    const d = `${year}-${pad(month + 1)}-01`;
    return d;
  }, [year, month]);

  const endDate = useMemo(() => {
    const last = new Date(year, month + 1, 0).getDate();
    return `${year}-${pad(month + 1)}-${pad(last)}`;
  }, [year, month]);

  const habitLogs = useQuery(api.habits.getLogsForDateRange, {
    startDate,
    endDate,
  });

  const tasks = useQuery(api.tasks.list, { status: 'done' });

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month]);

  // Count completions per day
  const completionMap = useMemo(() => {
    const map: Record<string, { habits: number; tasks: number }> = {};

    if (habitLogs) {
      for (const log of habitLogs) {
        if (!map[log.date]) map[log.date] = { habits: 0, tasks: 0 };
        if (log.completedAt) map[log.date].habits++;
      }
    }

    if (tasks) {
      for (const t of tasks) {
        if (t.dueDate) {
          if (!map[t.dueDate]) map[t.dueDate] = { habits: 0, tasks: 0 };
          map[t.dueDate].tasks++;
        }
      }
    }

    return map;
  }, [habitLogs, tasks]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const selectedInfo = selectedDate ? completionMap[selectedDate] : null;

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <CalIcon className="h-6 w-6 text-orange-400" /> Calendar
      </h1>

      {/* Month navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{MONTHS[month]} {year}</h2>
          <button onClick={goToday} className="text-xs text-ascend-400 hover:underline">Today</button>
        </div>
        <button onClick={nextMonth} className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface)]">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-[var(--text-secondary)] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const data = completionMap[dateStr];
          const hasActivity = data && (data.habits > 0 || data.tasks > 0);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={`relative flex h-12 md:h-16 flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                isSelected
                  ? 'bg-ascend-500 text-white'
                  : isToday
                    ? 'bg-ascend-500/20 text-ascend-400 font-bold'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface)]'
              }`}
            >
              {day}
              {hasActivity && !isSelected && (
                <div className="mt-0.5 flex gap-0.5">
                  {data.habits > 0 && <div className="h-1.5 w-1.5 rounded-full bg-green-400" />}
                  {data.tasks > 0 && <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mb-6 flex items-center gap-4 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-400" /> Habits completed
        </span>
        <span className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-400" /> Tasks completed
        </span>
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </h3>

          {selectedInfo ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm text-[var(--text-primary)]">
                  {selectedInfo.habits} habit{selectedInfo.habits !== 1 ? 's' : ''} completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-[var(--text-primary)]">
                  {selectedInfo.tasks} task{selectedInfo.tasks !== 1 ? 's' : ''} completed
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">No activity on this day</p>
          )}
        </div>
      )}
    </div>
  );
}
