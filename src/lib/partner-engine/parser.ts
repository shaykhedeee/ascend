/**
 * RESURGO — Partner Engine Repair/Retry Validator
 * BrainDump-style: strict Zod validation → repair prompt → hard retry → structured log.
 *
 * src/lib/partner-engine/parser.ts
 *
 * Usage:
 *   const result = await runPartnerEngineWithRetry({ llm, systemPrompt, userMessage, logger });
 *   if (result.ok) { applyActions(result.data.actions); }
 *   else { showUserMessage(result.message); }
 */
import { PartnerEngineOutput, type PartnerEngineOutputT } from "./output";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LLMCall = (args: {
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
  jsonMode?: boolean;
  timeoutMs?: number;
}) => Promise<{
  text: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
}>;

type Logger = (evt: Record<string, unknown>) => void;

type AttemptLog = {
  stage: string;
  errors?: string[];
  rawPreview?: string;
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Pull a JSON candidate out of whatever the model returned.
 * Priority: raw JSON → code fence → first `{`…last `}`.
 */
function extractJsonCandidate(raw: string): string {
  try {
    JSON.parse(raw);
    return raw;
  } catch {
    // not pure JSON
  }

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) return raw.slice(start, end + 1);

  return raw;
}

/**
 * Remove trailing commas and stray control chars that break JSON.parse.
 */
function sanitizeJson(s: string): string {
  return s
    .replace(/,\s*([}\]])/g, "$1")                              // trailing commas
    .replace(/[\u0000-\u001F\u007F]/g, (c) =>
      c === "\n" || c === "\r" || c === "\t" ? c : ""           // keep whitespace, strip ctrl
    );
}

/**
 * Full parse + Zod validation.
 */
function validatePartnerOutput(raw: string):
  | { ok: true; data: PartnerEngineOutputT }
  | { ok: false; errors: string[] } {
  const candidate = sanitizeJson(extractJsonCandidate(raw));

  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (e) {
    return { ok: false, errors: [`Invalid JSON: ${(e as Error).message}`] };
  }

  const result = PartnerEngineOutput.safeParse(parsed);
  if (result.success) return { ok: true, data: result.data };

  return {
    ok: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
    ),
  };
}

/**
 * Minimal instruction to get the model to fix its own output.
 */
function buildRepairPrompt(original: string, errors: string[]): string {
  return `
Fix the JSON to satisfy the schema exactly. Return ONLY corrected JSON.
No markdown. No extra text.

Errors:
${errors.map((e, i) => `${i + 1}. ${e}`).join("\n")}

Original:
${original}
  `.trim();
}

// ─── Main exported function ───────────────────────────────────────────────────

/**
 * Calls the LLM, validates its output against PartnerEngineOutput, and retries
 * up to 3 times (normal → repair → hard retry) before giving up.
 *
 * @param args.llm        - Provider-agnostic LLM caller (wraps provider-router)
 * @param args.systemPrompt - Pre-built system prompt (use buildPartnerEngineSystemPrompt)
 * @param args.userMessage  - Raw user turn text
 * @param args.logger       - Optional structured event logger
 * @param args.maxAttempts  - 3 (default, full repair cycle) or 2 (skip hard retry)
 */
export async function runPartnerEngineWithRetry(args: {
  llm: LLMCall;
  systemPrompt: string;
  userMessage: string;
  logger?: Logger;
  maxAttempts?: 3 | 2;
}): Promise<
  | {
      ok: true;
      data: PartnerEngineOutputT;
      meta: { attempts: number; provider?: string; model?: string };
    }
  | { ok: false; message: string; meta: { attempts: number } }
> {
  const { llm, systemPrompt, userMessage, logger } = args;
  const maxAttempts = args.maxAttempts ?? 3;

  const attemptsLog: AttemptLog[] = [];

  // ── Attempt 1: normal ─────────────────────────────────────────────────────

  const r1 = await llm({
    system: systemPrompt,
    user: userMessage,
    temperature: 0.35,
    maxTokens: 2500,
    jsonMode: true,
    timeoutMs: 15_000,
  });

  const v1 = validatePartnerOutput(r1.text);
  attemptsLog.push({
    stage: "parse-1",
    rawPreview: r1.text.slice(0, 400),
    ...(!v1.ok ? { errors: v1.errors } : {}),
  });

  if (v1.ok) {
    logger?.({
      event: "partner_engine_ok",
      attempts: 1,
      provider: r1.provider,
      model: r1.model,
      latencyMs: r1.latencyMs,
    });
    return {
      ok: true,
      data: v1.data,
      meta: { attempts: 1, provider: r1.provider, model: r1.model },
    };
  }

  // Early exit for 2-attempt mode
  if (maxAttempts === 2) {
    logger?.({ event: "partner_engine_failed", attempts: 1, attemptsLog });
    return {
      ok: false,
      message: "Couldn't process that safely. Please try again.",
      meta: { attempts: 1 },
    };
  }

  // ── Attempt 2: repair ─────────────────────────────────────────────────────

  const r2 = await llm({
    system: "You are a JSON repair assistant. Output ONLY valid JSON.",
    user: buildRepairPrompt(r1.text, v1.errors),
    temperature: 0.1,
    maxTokens: 2500,
    jsonMode: true,
    timeoutMs: 15_000,
  });

  const v2 = validatePartnerOutput(r2.text);
  attemptsLog.push({
    stage: "repair-2",
    rawPreview: r2.text.slice(0, 400),
    ...(!v2.ok ? { errors: v2.errors } : {}),
  });

  if (v2.ok) {
    logger?.({
      event: "partner_engine_ok_after_repair",
      attempts: 2,
      provider: r2.provider,
      model: r2.model,
      latencyMs: r2.latencyMs,
    });
    return {
      ok: true,
      data: v2.data,
      meta: { attempts: 2, provider: r2.provider, model: r2.model },
    };
  }

  // ── Attempt 3: hard retry (stricter prompt) ───────────────────────────────

  const r3 = await llm({
    system:
      systemPrompt +
      "\nCRITICAL: Return ONLY valid JSON. No prose. Double-check quotes/commas/brackets.",
    user: userMessage,
    temperature: 0.2,
    maxTokens: 2500,
    jsonMode: true,
    timeoutMs: 15_000,
  });

  const v3 = validatePartnerOutput(r3.text);
  attemptsLog.push({
    stage: "parse-3",
    rawPreview: r3.text.slice(0, 400),
    ...(!v3.ok ? { errors: v3.errors } : {}),
  });

  if (v3.ok) {
    logger?.({
      event: "partner_engine_ok_after_retry",
      attempts: 3,
      provider: r3.provider,
      model: r3.model,
      latencyMs: r3.latencyMs,
    });
    return {
      ok: true,
      data: v3.data,
      meta: { attempts: 3, provider: r3.provider, model: r3.model },
    };
  }

  // ── All attempts exhausted ────────────────────────────────────────────────

  logger?.({ event: "partner_engine_failed", attempts: 3, attemptsLog });

  return {
    ok: false,
    message:
      "I couldn't apply changes safely. Try a shorter message or split it into bullet points.",
    meta: { attempts: 3 },
  };
}
