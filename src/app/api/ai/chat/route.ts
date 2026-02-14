// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - AI Chat API Route (Cost-Optimized)
// Server-side AI endpoint using cheapest models with Atomic Habits knowledge
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { buildAtomicHabitsSystemPrompt } from '@/lib/atomic-habits-knowledge';

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION - Use cheapest models possible
// ─────────────────────────────────────────────────────────────────────────────────

// Server-side API keys (not exposed to client)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const GOOGLE_AI_KEY_BACKUP = process.env.GOOGLE_AI_STUDIO_KEY_BACKUP;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Model configurations - CHEAPEST options first
const MODELS = {
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
// AI PROVIDERS (Cheapest first)
// ─────────────────────────────────────────────────────────────────────────────────

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
      'HTTP-Referer': 'https://ascend.app',
      'X-Title': 'ASCEND AI Coach',
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

export async function POST(request: NextRequest): Promise<NextResponse<AIResponse>> {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const body = await request.json();
    const { messages, isPremium = false, context } = body as { 
      messages: ChatMessage[]; 
      isPremium?: boolean;
      context?: string;
    };

    // Rate limiting
    if (!checkRateLimit(ip, isPremium)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    // Build system prompt with Atomic Habits knowledge
    const systemPrompt = buildAtomicHabitsSystemPrompt();
    
    const systemMessage: ChatMessage = {
      role: 'system',
      content: context 
        ? `${systemPrompt}\n\nCURRENT CONTEXT: ${context}`
        : systemPrompt,
    };

    const fullMessages = [systemMessage, ...messages];

    let result: { text: string; model: string };
    let provider: string;

    // Try providers in order of cost efficiency: Groq -> Gemini -> OpenRouter
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

    return NextResponse.json({
      success: true,
      message: result.text,
      provider,
      model: result.model,
    });
  } catch (error) {
    console.error('AI Chat API error:', error);
    
    // Return a helpful fallback message instead of error
    const fallbackResponses = [
      "I'm having trouble connecting right now. Remember: every action is a vote for the type of person you wish to become. Keep going! 💪",
      "Connection hiccup! But here's a thought: You don't rise to your goals, you fall to your systems. Focus on the process!",
      "Technical difficulty, but don't let it stop you. Master the art of showing up—that's what matters most!",
    ];
    
    return NextResponse.json({
      success: true, // Return success with fallback
      message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      provider: 'fallback',
    });
  }
}
