import { generateTasksIcs, IcsTaskLike } from '@/lib/ics';

type ParsedEvent = {
  uid?: string;
  dtstamp?: string;
  dtstart?: string;
  dtend?: string;
  summary?: string;
  status?: string;
  rrule?: string;
};

function parseEvents(ics: string): ParsedEvent[] {
  const lines = ics.split('\r\n').filter(Boolean);
  const events: ParsedEvent[] = [];
  let current: ParsedEvent | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    if (line.startsWith('UID:')) current.uid = line.slice(4);
    if (line.startsWith('DTSTAMP:')) current.dtstamp = line.slice(8);
    if (line.startsWith('DTSTART:')) current.dtstart = line.slice(8);
    if (line.startsWith('DTEND:')) current.dtend = line.slice(6);
    if (line.startsWith('SUMMARY:')) current.summary = line.slice(8);
    if (line.startsWith('STATUS:')) current.status = line.slice(7);
    if (line.startsWith('RRULE:')) current.rrule = line.slice(6);
  }

  return events;
}

function assertProviderCompatibility(ics: string, provider: 'google' | 'apple' | 'outlook') {
  expect(ics).toContain('BEGIN:VCALENDAR');
  expect(ics).toContain('END:VCALENDAR');
  expect(ics).toContain('VERSION:2.0');
  expect(ics).toContain('PRODID:-//Resurgo//Task Calendar//EN');

  if (provider === 'outlook') {
    expect(ics).toContain('METHOD:PUBLISH');
  }

  if (provider === 'google') {
    expect(ics).toContain('CALSCALE:GREGORIAN');
  }

  if (provider === 'apple') {
    expect(ics).toContain('X-WR-CALNAME:');
  }
}

describe('ICS strict QA sweep', () => {
  const tasks: IcsTaskLike[] = [
    {
      _id: 'task-1',
      title: 'Deep Work Block',
      description: 'Focused project work',
      scheduledDate: '2026-02-21',
      dueTime: '09:30',
    },
    {
      _id: 'task-2',
      title: 'Weekly Review',
      dueDate: '2026-02-22',
      dueTime: '18:00',
      isRecurring: true,
      recurrenceRule: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [0, 2, 4],
      },
    },
    {
      _id: 'task-3',
      title: 'Daily Hydration Check',
      dueDate: '2026-02-21',
      isRecurring: true,
      recurrenceRule: {
        frequency: 'daily',
        interval: 1,
      },
    },
  ];

  it('passes malformed ICS integrity checks', () => {
    const ics = generateTasksIcs(tasks, 'Resurgo QA Calendar');

    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.endsWith('\r\n')).toBe(true);
    expect(ics).not.toContain('undefined');
    expect(ics).not.toContain('null');

    // Strict CRLF check
    const normalized = ics.replace(/\r\n/g, '');
    expect(normalized.includes('\n')).toBe(false);

    const events = parseEvents(ics);
    expect(events.length).toBe(3);

    const timestampRe = /^\d{8}T\d{6}Z$/;
    for (const ev of events) {
      expect(ev.uid).toBeTruthy();
      expect(ev.summary).toBeTruthy();
      expect(ev.status).toBe('CONFIRMED');
      expect(ev.dtstamp).toMatch(timestampRe);
      expect(ev.dtstart).toMatch(timestampRe);
      expect(ev.dtend).toMatch(timestampRe);
    }

    // Balanced VEVENT blocks
    const begins = (ics.match(/BEGIN:VEVENT/g) || []).length;
    const ends = (ics.match(/END:VEVENT/g) || []).length;
    expect(begins).toBe(ends);
  });

  it('passes Google Calendar import compatibility profile checks', () => {
    const ics = generateTasksIcs(tasks, 'Resurgo QA Calendar');
    assertProviderCompatibility(ics, 'google');
  });

  it('passes Apple Calendar import compatibility profile checks', () => {
    const ics = generateTasksIcs(tasks, 'Resurgo QA Calendar');
    assertProviderCompatibility(ics, 'apple');
  });

  it('passes Outlook import compatibility profile checks', () => {
    const ics = generateTasksIcs(tasks, 'Resurgo QA Calendar');
    assertProviderCompatibility(ics, 'outlook');
  });

  it('emits valid recurrence rules for weekly and daily events', () => {
    const ics = generateTasksIcs(tasks, 'Resurgo QA Calendar');

    expect(ics).toContain('RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,TU,TH');
    expect(ics).toContain('RRULE:FREQ=DAILY;INTERVAL=1');
  });
});
