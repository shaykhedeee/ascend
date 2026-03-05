// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Smart Fitness & Activity Suggestions API
// GET /api/fitness/suggestions
//
// Uses Open-Meteo (free, no API key) for weather-aware workout recommendations.
// Combines weather data with the user's wellness state (mood, energy, sleep)
// to suggest the most appropriate workouts for today.
//
// Free APIs used:
//   - Open-Meteo: https://api.open-meteo.com — weather data (completely free, no key)
//
// If no location is provided, uses wellness state alone for suggestions.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { callAI } from '@/lib/ai/provider-router';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windspeed: number;
  isRaining: boolean;
  description: string;
}

interface WorkoutSuggestion {
  name: string;
  duration: string;
  intensity: 'low' | 'moderate' | 'high';
  type: 'outdoor' | 'indoor' | 'any';
  description: string;
  benefit: string;
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Moderate showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail',
};

function parseWeatherCode(code: number): { description: string; isRaining: boolean } {
  return {
    description: WMO_DESCRIPTIONS[code] ?? 'Variable weather',
    isRaining: [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96].includes(code),
  };
}

async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat.toString());
    url.searchParams.set('longitude', lon.toString());
    url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m');
    url.searchParams.set('temperature_unit', 'celsius');
    url.searchParams.set('forecast_days', '1');

    const res = await fetch(url.toString(), { cache: 'no-store' }); // weather changes hourly
    if (!res.ok) return null;

    const data = (await res.json()) as {
      current: { temperature_2m: number; weather_code: number; wind_speed_10m: number };
    };

    const { temperature_2m, weather_code, wind_speed_10m } = data.current;
    const { description, isRaining } = parseWeatherCode(weather_code);

    return {
      temperature: Math.round(temperature_2m),
      weatherCode: weather_code,
      windspeed: Math.round(wind_speed_10m),
      isRaining,
      description,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const mood = parseInt(searchParams.get('mood') ?? '3');
  const energy = parseInt(searchParams.get('energy') ?? '3');
  const sleep = parseInt(searchParams.get('sleep') ?? '3');
  const stepsToday = parseInt(searchParams.get('steps') ?? '0');

  // Fetch weather if location provided
  let weather: WeatherData | null = null;
  if (lat && lon) {
    weather = await getWeather(parseFloat(lat), parseFloat(lon));
  }

  // Build context for AI
  const energyLabels = ['', 'Empty', 'Low', 'Mid', 'High', 'Peak'];
  const moodLabels = ['', 'Drained', 'Low', 'Neutral', 'Good', 'Fired Up'];
  const sleepLabels = ['', 'Terrible', 'Poor', 'Ok', 'Good', 'Great'];

  const weatherContext = weather
    ? `Weather: ${weather.temperature}°C, ${weather.description}, Wind: ${weather.windspeed}km/h, ${weather.isRaining ? 'raining' : 'no rain'}`
    : 'Weather: unknown (indoor suggestions only)';

  const stepsContext = stepsToday > 0
    ? `Steps so far today: ${stepsToday.toLocaleString()} (goal: 8,000)`
    : 'Steps today: not tracked yet';

  const systemPrompt = `You are a certified fitness coach for Resurgo. Generate personalized workout suggestions based on the user's current state and conditions.

USER STATE:
- Mood: ${moodLabels[mood] || 'Neutral'} (${mood}/5)
- Energy: ${energyLabels[energy] || 'Mid'} (${energy}/5)
- Sleep quality: ${sleepLabels[sleep] || 'Ok'} (${sleep}/5)
- ${stepsContext}
- ${weatherContext}

RULES:
- Low energy/mood (<=2): Recommend gentle movement only (walk, yoga, stretching)
- Medium energy (3): Moderate workouts (light gym, cycling, swimming)
- High energy (4-5): Intense training is fine (HIIT, running, heavy lifting)
- If raining or cold (<5C): Prefer indoor options
- Never suggest intense workouts when sleep is <=2 (recovery risk)
- Always include at least one "micro" option (<10 mins) for busy days

OUTPUT (JSON only):
{
  "suggestions": [
    {
      "name": "workout name",
      "duration": "X-Y minutes",
      "intensity": "low|moderate|high",
      "type": "outdoor|indoor|any",
      "description": "one-line description of what to do",
      "benefit": "specific benefit for today's state"
    }
  ],
  "dailyTip": "one sentence about fitness for today",
  "recoveryAlert": "optional — include only if sleep <=2 or energy <=1"
}`;

  try {
    const aiRes = await callAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate 3-4 workout suggestions optimized for my current state.' },
      ],
      { taskType: 'json', maxTokens: 800, temperature: 0.6, requireJson: true },
    );

    let parsed: {
      suggestions: WorkoutSuggestion[];
      dailyTip: string;
      recoveryAlert?: string;
    };

    try {
      let text = aiRes.content.trim();
      if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      }
      parsed = JSON.parse(text);
    } catch {
      // Fallback if AI does not return valid JSON
      parsed = {
        suggestions: [
          { name: 'Brisk Walk', duration: '20-30 minutes', intensity: 'low', type: 'outdoor', description: '20-30 minute brisk walk', benefit: 'Boosts mood and circulation' },
          { name: 'Yoga Flow', duration: '15-20 minutes', intensity: 'low', type: 'indoor', description: '15-20 minute yoga or stretching session', benefit: 'Improves flexibility and reduces stress' },
          { name: 'Bodyweight Circuit', duration: '20 minutes', intensity: 'moderate', type: 'indoor', description: 'Push-ups, squats, lunges, planks — 3 rounds', benefit: 'Builds strength without equipment' },
        ],
        dailyTip: 'Movement is medicine — even 10 minutes makes a difference.',
      };
    }

    return NextResponse.json({
      ...parsed,
      weather: weather ?? undefined,
      stepsRemaining: Math.max(0, 8000 - stepsToday),
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Fitness API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate fitness suggestions' },
      { status: 500 },
    );
  }
}
