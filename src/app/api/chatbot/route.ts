// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Advanced AI Chatbot API Route
// Multi-provider intelligent chatbot with sales skills and app expertise
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { 
  buildChatbotSystemPrompt, 
  detectIntent, 
  getQuickResponse,
  FAQ,
  CHATBOT_PERSONA,
  UserIntent
} from '@/lib/ascend-knowledge-base';

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const AIML_API_KEY = process.env.AIML_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Model configuration - prioritize speed and cost for chat
const MODELS = {
  aiml: {
    free: 'mistralai/Mistral-7B-Instruct-v0.2', // Fast and cheap
    premium: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', // Powerful
  },
  groq: {
    free: 'llama-3.1-8b-instant',
    premium: 'llama-3.3-70b-versatile',
  },
  gemini: {
    free: 'gemini-1.5-flash',
    premium: 'gemini-1.5-pro',
  },
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  userContext?: {
    plan?: 'free' | 'pro' | 'lifetime';
    habitsCount?: number;
    currentStreak?: number;
    daysActive?: number;
    recentActivity?: string;
  };
  isPremium?: boolean;
}

interface ChatResponse {
  success: boolean;
  message?: string;
  intent?: UserIntent;
  source?: 'quick' | 'ai' | 'fallback';
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI PROVIDERS
// ─────────────────────────────────────────────────────────────────────────────────

async function callAIML(
  messages: ChatMessage[],
  isPremium: boolean
): Promise<string> {
  if (!AIML_API_KEY) throw new Error('AIML API key not configured');

  const model = isPremium ? MODELS.aiml.premium : MODELS.aiml.free;

  const response = await fetch('https://api.aimlapi.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AIML_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: isPremium ? 1024 : 512,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AIML API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callGroq(
  messages: ChatMessage[],
  isPremium: boolean
): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('Groq API key not configured');

  const model = isPremium ? MODELS.groq.premium : MODELS.groq.free;

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
      max_tokens: isPremium ? 1024 : 512,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callGemini(
  messages: ChatMessage[],
  isPremium: boolean
): Promise<string> {
  if (!GOOGLE_AI_KEY) throw new Error('Google AI key not configured');

  const model = isPremium ? MODELS.gemini.premium : MODELS.gemini.free;
  
  // Convert messages to Gemini format
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Add system instruction
  const systemMessage = messages.find(m => m.role === 'system');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_AI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: isPremium ? 1024 : 512,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenRouter(
  messages: ChatMessage[],
): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API key not configured');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://ascend.app',
      'X-Title': 'ASCEND Chatbot',
    },
    body: JSON.stringify({
      model: 'google/gemma-2-9b-it:free',
      messages,
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// ─────────────────────────────────────────────────────────────────────────────────
// FAQ MATCHER (No AI cost)
// ─────────────────────────────────────────────────────────────────────────────────

function findFAQAnswer(message: string): string | null {
  const lower = message.toLowerCase();
  
  // Search all FAQ categories
  const allFAQs = [
    ...FAQ.gettingStarted,
    ...FAQ.features,
    ...FAQ.account,
    ...FAQ.troubleshooting,
  ];
  
  // Simple keyword matching
  for (const faq of allFAQs) {
    const questionWords = faq.q.toLowerCase().split(/\s+/);
    const messageWords = lower.split(/\s+/);
    
    // Count matching significant words (3+ characters)
    const matches = questionWords.filter(
      w => w.length >= 3 && messageWords.some(m => m.includes(w) || w.includes(m))
    );
    
    // If more than 30% match, return this answer
    if (matches.length >= questionWords.filter(w => w.length >= 3).length * 0.3) {
      return faq.a;
    }
  }
  
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const body = await request.json() as ChatRequest;
    const { message, history = [], userContext, isPremium = false } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // 1. Detect intent
    const intent = detectIntent(message);

    // 2. Try quick response (no AI cost)
    const quickResponse = getQuickResponse(intent);
    if (quickResponse) {
      return NextResponse.json({
        success: true,
        message: quickResponse,
        intent,
        source: 'quick',
      });
    }

    // 3. Try FAQ match (no AI cost)
    const faqAnswer = findFAQAnswer(message);
    if (faqAnswer) {
      return NextResponse.json({
        success: true,
        message: faqAnswer,
        intent,
        source: 'quick',
      });
    }

    // 4. Build conversation for AI
    const systemPrompt = buildChatbotSystemPrompt(userContext);
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ];

    // 5. Try AI providers in order
    let aiResponse: string = '';
    
    // Priority: AIML (new) -> Groq (fast) -> Gemini (reliable) -> OpenRouter (backup)
    try {
      aiResponse = await callAIML(messages, isPremium);
    } catch (aimlError) {
      console.warn('AIML failed:', (aimlError as Error).message);
      try {
        aiResponse = await callGroq(messages, isPremium);
      } catch (groqError) {
        console.warn('Groq failed:', (groqError as Error).message);
        try {
          aiResponse = await callGemini(messages, isPremium);
        } catch (geminiError) {
          console.warn('Gemini failed:', (geminiError as Error).message);
          try {
            aiResponse = await callOpenRouter(messages);
          } catch (openRouterError) {
            console.warn('All AI providers failed:', (openRouterError as Error).message);
            // Return intelligent fallback
            const fallback = CHATBOT_PERSONA.fallbacks[
              Math.floor(Math.random() * CHATBOT_PERSONA.fallbacks.length)
            ];
            return NextResponse.json({
              success: true,
              message: fallback,
              intent,
              source: 'fallback',
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: aiResponse,
      intent,
      source: 'ai',
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong. Please try again.',
        message: CHATBOT_PERSONA.fallbacks[0],
      },
      { status: 500 }
    );
  }
}
