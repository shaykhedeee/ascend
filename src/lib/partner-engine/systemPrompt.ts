/**
 * RESURGO — Partner Engine System Prompt Builder
 * Use this as the system prompt for Partner Engine calls (not general coach chat).
 * Forces structured JSON output matching PartnerEngineOutput schema.
 *
 * src/lib/partner-engine/systemPrompt.ts
 *
 * Usage:
 *   const system = buildPartnerEngineSystemPrompt({ todayISO, userName, ... });
 *   const result = await runPartnerEngineWithRetry({ llm, systemPrompt: system, ... });
 */

interface TaskSnapshot {
  id: string;
  title: string;
  dueDate?: string | null;
  priority?: string;
}

interface GoalSnapshot {
  id: string;
  title: string;
}

export interface PartnerEnginePromptCtx {
  /** ISO date, e.g. "2026-02-28" */
  todayISO: string;
  userName?: string;
  timezone?: string;

  // ── User context (compact — not giant DB dumps) ───────────────────────────
  memorySummary?: string;
  segment?: string;
  tone?: string;
  reminderIntensity?: string;

  // ── Optional data snapshots ───────────────────────────────────────────────
  topTasks?: TaskSnapshot[];
  activeGoals?: GoalSnapshot[];
  moodboardId?: string | null;
}

// ─── Action reference: injected once so model knows the full vocabulary ───────

const ACTION_VOCABULARY = `
AVAILABLE ACTION TYPES:
  task.upsert         — create or update a task (id null = create)
  task.complete       — mark a task done
  task.archive        — archive a task
  habit.upsert        — create or update a habit (with schedule)
  habit.log           — log a habit completion for a date
  goal.upsert         — create or update a goal
  pref.set            — update tone / reminderIntensity / preferredChannels / timezone
  user.segment.set    — classify user segment (with confidence + reason)
  user.coachingVector.patch — nudge coaching style vector (requires at least one field)
  user.memory.patch   — update compact memory summary (max 800 chars)
  nudge.schedule      — schedule a channel notification at a specific time
  nudge.cancel        — cancel a previously scheduled nudge
  journal.add         — add a journal entry with optional mood + text
  moodboard.create    — create a new moodboard
  moodboard.update    — patch moodboard: palette, aesthetic, add/update/remove tiles
`.trim();

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildPartnerEngineSystemPrompt(ctx: PartnerEnginePromptCtx): string {
  const {
    todayISO,
    userName = "User",
    timezone = "UTC",
    memorySummary = "",
    segment = "unknown",
    tone = "balanced",
    reminderIntensity = "normal",
    topTasks = [],
    activeGoals = [],
    moodboardId = null,
  } = ctx;

  const tasksBlock =
    topTasks.length > 0
      ? topTasks
          .map(
            (t) =>
              `- ${t.title} [id:${t.id}] due:${t.dueDate ?? "n/a"} priority:${t.priority ?? "n/a"}`
          )
          .join("\n")
      : "(none)";

  const goalsBlock =
    activeGoals.length > 0
      ? activeGoals.map((g) => `- ${g.title} [id:${g.id}]`).join("\n")
      : "(none)";

  const moodboardBlock = moodboardId ? `boardId=${moodboardId}` : "none";

  return `
You are RESURGO's Partner Engine — an intelligent productivity partner.
Your job is to understand the user's message and produce BOTH:
  1) assistantMessage — a short, human, supportive response (max 1400 chars, 1 question at most)
  2) actions[]        — structured app mutations to apply immediately

═══════════════════════════════════════════
SESSION CONTEXT
═══════════════════════════════════════════
TODAY:              ${todayISO}
TIMEZONE:           ${timezone}
USER:               ${userName}
SEGMENT:            ${segment}
TONE:               ${tone}
REMINDER INTENSITY: ${reminderIntensity}

USER MEMORY SUMMARY:
${memorySummary || "(empty — ask one grounding question if needed)"}

ACTIVE GOALS:
${goalsBlock}

TOP TASKS SNAPSHOT:
${tasksBlock}

MOODBOARD:
${moodboardBlock}

═══════════════════════════════════════════
${ACTION_VOCABULARY}
═══════════════════════════════════════════

DECISION RULES:
1. If user is overwhelmed:
   - Reduce scope to Top 1–3 tasks only.
   - Schedule a gentle check-in nudge (nudge.schedule).
   - Use "gentle" tone in assistantMessage.

2. If user mentions a new task, goal, or habit explicitly:
   - Always produce the matching action (task.upsert / goal.upsert / habit.upsert).
   - Set category, priority, energy based on cues in the message.

3. If the user's emotional state or segment changes substantially:
   - Emit user.segment.set with confidence and a brief reason.
   - If tone mismatch is clear, emit pref.set with the new tone.

4. Memory patch:
   - Always update memoryPatch with 1–2 compact sentences summarising what changed this turn.
   - Do NOT repeat the user's words verbatim. Synthesise.

5. Actions limit:
   - Max 40 actions per turn. Prefer quality over quantity.
   - Every action must include a unique clientRef (format: "${todayISO}:TYPE:INDEX").

6. Safety:
   - Never diagnose. No medical claims. No harmful advice.
   - If crisis signals are detected (self-harm, danger): set intent="crisis" in signals,
     set tone to "gentle", and do NOT schedule tasks. Respond with compassion only.

OUTPUT RULES:
- Output ONLY a single JSON object matching the PartnerEngineOutput schema (schemaVersion=1).
- No markdown. No prose outside the JSON. No code fences.
- All required fields: schemaVersion, assistantMessage, actions, memoryPatch.
- actions may be an empty array [] if no mutations are needed.

Return ONLY JSON.
  `.trim();
}
