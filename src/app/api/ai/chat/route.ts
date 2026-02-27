// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI Chat API Route (Cost-Optimized)
// Ollama-first with cloud fallback cascade
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { buildAtomicHabitsSystemPrompt } from '@/lib/atomic-habits-knowledge';
import { addSecurityHeaders, isTrustedOrigin, sanitizeString } from '@/lib/security';

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION - Use cheapest models possible
// ─────────────────────────────────────────────────────────────────────────────────

// Server-side API keys (not exposed to client)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const GOOGLE_AI_KEY_BACKUP = process.env.GOOGLE_AI_STUDIO_KEY_BACKUP;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';

// Model configurations - local-first, then cheapest cloud options
const MODELS = {
  // Ollama - local, zero-cost
  ollama: {
    free: 'dolphin-phi:latest',    // 1.6 GB — fastest local model
    premium: 'dolphin3:latest',    // 4.9 GB — best local model
  },
  // Groq - FREE tier, very fast
  groq: {
    free: 'llama-3.1-8b-instant',      // Fastest, cheapest
    premium: 'llama-3.3-70b-versatile', // Better quality for paid users
  },
  // Gemini - FREE tier available
  gemini: {
    free: 'gemini-1.5-flash',           // Free tier available
    premium: 'gemini-1.5-pro',          // Better quality
  },
  // OpenRouter - Access to many free models
  openrouter: {
    free: 'google/gemma-2-9b-it:free',  // Completely FREE
    premium: 'anthropic/claude-3.5-sonnet',
  },
};

// Response limits to save tokens
const MAX_TOKENS = {
  free: 512,
  premium: 1024,
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  provider?: string;
  model?: string;
  fallback?: boolean;
}

function secureJson(body: AIResponse, status: number = 200): NextResponse {
  return addSecurityHeaders(NextResponse.json(body, { status }));
}

// ─────────────────────────────────────────────────────────────────────────────────
// RATE LIMITING (Protect API costs)
// ─────────────────────────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_FREE = 20;      // Free users: 20 requests per minute
const RATE_LIMIT_PREMIUM = 60;   // Premium users: 60 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip: string, isPremium: boolean = false): boolean {
  const limit = isPremium ? RATE_LIMIT_PREMIUM : RATE_LIMIT_FREE;
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI PROVIDERS (local-first, then cloud cascade)
// ─────────────────────────────────────────────────────────────────────────────────

// 0. OLLAMA - local, zero-cost (tried first if running)
async function callOllama(messages: ChatMessage[], isPremium: boolean): Promise<{ text: string; model: string }> {
  if (!OLLAMA_BASE_URL) throw new Error('Ollama not configured');
  const model = isPremium ? MODELS.ollama.premium : MODELS.ollama.free;
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: { temperature: 0.7, num_predict: isPremium ? 1024 : 512 },
      }),
    });
    clearTimeout(tid);
    if (!response.ok) throw new Error(`Ollama ${response.status}: ${await response.text()}`);
    const data = await response.json() as { message?: { content?: string } };
    return { text: data.message?.content ?? '', model };
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
}

// 1. GROQ - Primary (Fast & Free tier)
async function callGroq(messages: ChatMessage[], isPremium: boolean): Promise<{ text: string; model: string }> {
  if (!GROQ_API_KEY) throw new Error('Groq API key not configured');
  
  const model = isPremium ? MODELS.groq.premium : MODELS.groq.free;
  const maxTokens = isPremium ? MAX_TOKENS.premium : MAX_TOKENS.free;
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return { 
    text: data.choices[0]?.message?.content || '',
    model,
  };
}

// 2. GEMINI - Secondary (Free tier available)
async function callGemini(messages: ChatMessage[], isPremium: boolean, useBackup: boolean = false): Promise<{ text: string; model: string }> {
  const apiKey = useBackup ? GOOGLE_AI_KEY_BACKUP : GOOGLE_AI_KEY;
  if (!apiKey) throw new Error('Google AI key not configured');
  
  const model = isPremium ? MODELS.gemini.premium : MODELS.gemini.free;
  const maxTokens = isPremium ? MAX_TOKENS.premium : MAX_TOKENS.free;
  
  // Convert messages to Gemini format
  const prompt = messages.map(m => {
    if (m.role === 'system') return `Instructions: ${m.content}\n`;
    if (m.role === 'user') return `User: ${m.content}\n`;
    return `Assistant: ${m.content}\n`;
  }).join('');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens,
        },
      }),
    }
  );

  if (!response.ok) {
    // Try backup key if primary fails
    if (!useBackup && GOOGLE_AI_KEY_BACKUP) {
      return callGemini(messages, isPremium, true);
    }
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    model,
  };
}

// 3. OpenRouter - Backup (Access to free models)
async function callOpenRouter(messages: ChatMessage[], isPremium: boolean): Promise<{ text: string; model: string }> {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API key not configured');
  
  const model = isPremium ? MODELS.openrouter.premium : MODELS.openrouter.free;
  const maxTokens = isPremium ? MAX_TOKENS.premium : MAX_TOKENS.free;
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://resurgo.life',
      'X-Title': 'Resurgo AI Coach',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content || '',
    model,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN API HANDLER
// ─────────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isTrustedOrigin(request)) {
      return secureJson({ success: false, error: 'Invalid request origin' }, 403);
    }

    // ────────────────────────────────────────────────────────────────────────
    // 1) Verify authentication - prevent unauthorized API abuse
    // ────────────────────────────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return secureJson({ success: false, error: 'Unauthorized' }, 401);
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const body = await request.json();
    const { messages, context } = body as {
      messages: ChatMessage[]; 
      context?: string;
    };

    // Determine premium status server-side — never trust the client
    // Check Clerk public metadata for plan, default to free
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    const userPlan = (clerkUser?.publicMetadata as Record<string, unknown>)?.plan || 'free';
    const isPremium = userPlan === 'pro' || userPlan === 'lifetime';

    // Rate limiting
    if (!checkRateLimit(ip, isPremium)) {
      return secureJson({ success: false, error: 'Rate limit exceeded. Please try again in a minute.' }, 429);
    }

    if (!messages || !Array.isArray(messages)) {
      return secureJson({ success: false, error: 'Invalid request: messages array required' }, 400);
    }

    const sanitizedMessages: ChatMessage[] = messages
      .slice(-20)
      .map((message) => ({
        role: message.role,
        content: sanitizeString(String(message.content || ''), { maxLength: 2000, allowNewlines: true }),
      }));

    // Build system prompt with Atomic Habits knowledge
    const systemPrompt = buildAtomicHabitsSystemPrompt();
    
    const systemMessage: ChatMessage = {
      role: 'system',
      content: context
        ? `${systemPrompt}\n\nCURRENT CONTEXT: ${sanitizeString(String(context), { maxLength: 1000, allowNewlines: true })}`
        : systemPrompt,
    };

    const fullMessages = [systemMessage, ...sanitizedMessages];

    let result: { text: string; model: string };
    let provider: string;

    // Try providers in order: Ollama (local) -> Groq -> Gemini -> OpenRouter
    try {
      result = await callOllama(fullMessages, isPremium);
      provider = 'ollama';
    } catch {
      try {
        result = await callGroq(fullMessages, isPremium);
        provider = 'groq';
      } catch (groqError) {
        console.warn('Groq failed, trying Gemini:', (groqError as Error).message);
        try {
          result = await callGemini(fullMessages, isPremium);
          provider = 'gemini';
        } catch (geminiError) {
          console.warn('Gemini failed, trying OpenRouter:', (geminiError as Error).message);
          result = await callOpenRouter(fullMessages, isPremium);
          provider = 'openrouter';
        }
      }
    }

    return secureJson({
      success: true,
      message: result.text,
      provider,
      model: result.model,
    });
  } catch (error) {
    console.error('AI Chat API error:', error);
    
    // Return a helpful fallback message instead of error
    const fallbackResponses = [
      "I'm having trouble connecting right now. Remember: every action is a vote for the type of person you wish to become. Keep going.",
      "Connection hiccup! But here's a thought: You don't rise to your goals, you fall to your systems. Focus on the process!",
      "Technical difficulty, but don't let it stop you. Master the art of showing up—that's what matters most!",
    ];
    
    return secureJson({
      success: true,
      fallback: true, // Signal to the client this is a fallback, not a real AI response
      message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      provider: 'fallback',
    });
  }
}
