// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - AI Suggestions API Route (Cost-Optimized)
// Server-side AI endpoint for habit suggestions and insights using Atomic Habits
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { 
  FOUR_LAWS, 
  COACHING_MESSAGES,
  getRandomQuote,
  getRandomCoachingMessage,
} from '@/lib/atomic-habits-knowledge';

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const GOOGLE_AI_KEY_BACKUP = process.env.GOOGLE_AI_STUDIO_KEY_BACKUP;

// Use cheapest models
const MODELS = {
  groq: 'llama-3.1-8b-instant',
  gemini: 'gemini-1.5-flash',
};

interface SuggestionsRequest {
  type: 'habits' | 'insights' | 'coaching' | 'quote' | 'law';
  context: {
    goals?: string[];
    habits?: { name: string; streak: number; completionRate: number }[];
    recentActivity?: string[];
    userLevel?: number;
    identities?: string[];
    trigger?: string;
  };
  isPremium?: boolean;
}

interface SuggestionsResponse {
  success: boolean;
  suggestions?: string[];
  insights?: string[];
  coachingMessage?: string;
  quote?: { text: string; context: string };
  law?: { name: string; strategies: string[] };
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI PROVIDERS (Cheapest first)
// ─────────────────────────────────────────────────────────────────────────────────

async function callGroq(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('Groq API key not configured');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODELS.groq,
      messages: [
        { 
          role: 'system', 
          content: `You are an expert habit coach based on Atomic Habits by James Clear. 
Always respond with valid JSON. Be concise.
Key principles: 1% improvements compound, identity-based habits, 4 Laws (Obvious, Attractive, Easy, Satisfying).` 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 512, // Keep low for cost savings
    }),
  });

  if (!response.ok) throw new Error(`Groq API error: ${await response.text()}`);
  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callGemini(prompt: string, useBackup = false): Promise<string> {
  const apiKey = useBackup ? GOOGLE_AI_KEY_BACKUP : GOOGLE_AI_KEY;
  if (!apiKey) throw new Error('Google AI key not configured');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `You are an expert habit coach based on Atomic Habits. Always respond with valid JSON. Be concise.\n\n${prompt}` 
          }] 
        }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 512,
        },
      }),
    }
  );

  if (!response.ok) {
    if (!useBackup && GOOGLE_AI_KEY_BACKUP) {
      return callGemini(prompt, true);
    }
    throw new Error(`Gemini API error: ${await response.text()}`);
  }
  
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function getAIResponse(prompt: string): Promise<string> {
  try {
    return await callGroq(prompt);
  } catch (groqError) {
    console.warn('Groq failed for suggestions:', (groqError as Error).message);
    return await callGemini(prompt);
  }
}

function parseJsonResponse(content: string): unknown {
  let jsonStr = content.trim();
  
  // Try to extract JSON from markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();
  
  // Clean up common issues
  jsonStr = jsonStr.replace(/^[^[\{]*/, '').replace(/[^\]\}]*$/, '');
  
  try {
    return JSON.parse(jsonStr);
  } catch {
    // If parsing fails, try to extract array or object
    const arrayMatch = content.match(/\[[\s\S]*\]/);
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
    if (objectMatch) return JSON.parse(objectMatch[0]);
    throw new Error('Failed to parse JSON response');
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// LOCAL SUGGESTIONS (No AI cost - use knowledge base)
// ─────────────────────────────────────────────────────────────────────────────────

function getLocalCoaching(trigger?: string): string {
  if (trigger) {
    const message = getRandomCoachingMessage(trigger);
    if (message) return message;
  }
  
  // Default to identity-based coaching
  const messages = COACHING_MESSAGES.find(m => m.trigger === 'identity_building')?.messages || [];
  return messages[Math.floor(Math.random() * messages.length)] || 
    "Every action is a vote for the type of person you wish to become. Keep building that identity! 💪";
}

function getLocalQuote(tags?: string[]): { text: string; context: string } {
  const quote = getRandomQuote(tags);
  return { text: quote.text, context: quote.context };
}

function getRelevantLaw(context: { habits?: { streak: number; completionRate: number }[] }): { name: string; strategies: string[] } {
  // Determine which law is most relevant based on user data
  const habits = context.habits || [];
  const avgCompletion = habits.length > 0 
    ? habits.reduce((acc, h) => acc + h.completionRate, 0) / habits.length 
    : 0;
  
  let lawIndex = 0;
  
  if (avgCompletion < 30) {
    // Struggling to start - Make it Easy
    lawIndex = 2;
  } else if (avgCompletion < 60) {
    // Starting but not consistent - Make it Obvious
    lawIndex = 0;
  } else if (avgCompletion < 80) {
    // Consistent but losing motivation - Make it Attractive
    lawIndex = 1;
  } else {
    // Doing well - Make it Satisfying
    lawIndex = 3;
  }
  
  const law = FOUR_LAWS[lawIndex];
  return {
    name: `Law ${law.number}: ${law.name}`,
    strategies: law.strategies.map(s => s.name),
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN API HANDLER
// ─────────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<SuggestionsResponse>> {
  try {
    const body = await request.json() as SuggestionsRequest;
    const { type, context, isPremium = false } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Type is required' },
        { status: 400 }
      );
    }

    const result: SuggestionsResponse = { success: true };

    switch (type) {
      // ─────────────────────────────────────────────────────────────────────────
      // QUOTE - No AI cost, use local knowledge base
      // ─────────────────────────────────────────────────────────────────────────
      case 'quote':
        result.quote = getLocalQuote();
        break;

      // ─────────────────────────────────────────────────────────────────────────
      // LAW - No AI cost, use local knowledge base
      // ─────────────────────────────────────────────────────────────────────────
      case 'law':
        result.law = getRelevantLaw(context);
        break;

      // ─────────────────────────────────────────────────────────────────────────
      // COACHING - Try local first, AI only if premium
      // ─────────────────────────────────────────────────────────────────────────
      case 'coaching':
        if (!isPremium) {
          // Free users get local coaching (no AI cost)
          result.coachingMessage = getLocalCoaching(context.trigger);
        } else {
          // Premium users get AI-personalized coaching
          const prompt = `Generate a personalized coaching message (1-2 sentences) for:
Level: ${context.userLevel || 1}
Goals: ${context.goals?.join(', ') || 'General improvement'}
Active Habits: ${context.habits?.length || 0}
Best Streak: ${Math.max(...(context.habits?.map(h => h.streak) || [0]))} days

Use Atomic Habits principles. Return JSON: {"message": "your message"}`;

          try {
            const response = await getAIResponse(prompt);
            const parsed = parseJsonResponse(response) as { message: string };
            result.coachingMessage = parsed.message;
          } catch {
            result.coachingMessage = getLocalCoaching(context.trigger);
          }
        }
        break;

      // ─────────────────────────────────────────────────────────────────────────
      // HABITS - AI-powered (premium only gets better suggestions)
      // ─────────────────────────────────────────────────────────────────────────
      case 'habits':
        const habitCount = isPremium ? 5 : 3;
        const prompt = `Suggest ${habitCount} specific habits based on Atomic Habits principles.

User Goals: ${context.goals?.join(', ') || 'Self-improvement'}
Current Habits: ${context.habits?.map(h => h.name).join(', ') || 'None yet'}
Identities: ${context.identities?.join(', ') || 'Not specified'}

Each habit should:
- Follow the Two-Minute Rule (easy to start)
- Support identity-based change
- Be specific and actionable

Return JSON array: ["Habit 1", "Habit 2", ...]`;

        try {
          const response = await getAIResponse(prompt);
          result.suggestions = parseJsonResponse(response) as string[];
        } catch {
          // Fallback suggestions from Atomic Habits
          result.suggestions = [
            "Read one page of a book before bed (builds reader identity)",
            "Do 2 pushups after your morning coffee (habit stacking)",
            "Write one sentence in a journal after dinner (Two-Minute Rule)",
          ];
        }
        break;

      // ─────────────────────────────────────────────────────────────────────────
      // INSIGHTS - AI-powered analysis
      // ─────────────────────────────────────────────────────────────────────────
      case 'insights':
        if (!context.habits || context.habits.length === 0) {
          result.insights = [
            "Start with just one habit—master showing up before optimizing",
            "Remember: You don't rise to your goals, you fall to your systems",
            "Focus on becoming the type of person who has good habits",
          ];
        } else {
          const insightPrompt = `Analyze this habit data and give ${isPremium ? 4 : 2} insights:

${context.habits.map(h => `- ${h.name}: ${h.streak} day streak, ${h.completionRate}% completion`).join('\n')}

Use Atomic Habits principles. Be specific and actionable.
Return JSON array: ["Insight 1", "Insight 2", ...]`;

          try {
            const response = await getAIResponse(insightPrompt);
            result.insights = parseJsonResponse(response) as string[];
          } catch {
            // Fallback insights based on data
            const avgStreak = context.habits.reduce((a, h) => a + h.streak, 0) / context.habits.length;
            result.insights = avgStreak < 7
              ? ["Focus on never missing twice—that's how habits die", "Try habit stacking: attach new habits to existing routines"]
              : ["Great consistency! Now optimize—how can you make these habits 1% better?", "Consider adding a harder challenge to avoid the boredom plateau"];
          }
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid suggestion type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Suggestions API error:', error);
    
    // Always return something useful
    return NextResponse.json({
      success: true,
      coachingMessage: getLocalCoaching(),
      quote: getLocalQuote(),
    });
  }
}
