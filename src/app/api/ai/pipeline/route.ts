// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Multi-Model AI Pipeline API
// POST /api/ai/pipeline
//
// Runs user input through a sequential multi-stage AI pipeline.
// Each stage refines the previous stage's output using a different model/role.
//
// Modes:
//   - "deep_analysis"  : 4-stage parse→analyze→synthesize→recommend (default)
//   - "custom"         : Provide your own stages array
//
// Use this for: goal decomposition, weekly reviews, psychology profiles,
// habit suggestions, and any task requiring deep multi-model reasoning.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { runDeepAnalysisPipeline, runAIPipeline, type PipelineStageConfig } from '@/lib/ai/provider-router';

export const maxDuration = 90; // Multi-model pipeline needs more time

type PipelineMode = 'deep_analysis' | 'custom';

interface PipelineRequest {
  userInput: string;
  mode?: PipelineMode;
  stages?: PipelineStageConfig[];       // Required when mode === 'custom'
  context?: string;                     // Optional user context (name, goals, etc.)
  includeStageDetails?: boolean;        // Return per-stage outputs (default: false)
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: PipelineRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { userInput, mode = 'deep_analysis', stages, context, includeStageDetails = false } = body;

  if (!userInput?.trim()) {
    return NextResponse.json({ error: '"userInput" is required' }, { status: 400 });
  }

  if (mode === 'custom' && (!stages || stages.length === 0)) {
    return NextResponse.json({ error: 'Custom mode requires "stages" array' }, { status: 400 });
  }

  // Fetch user context if not provided
  let userName = 'User';
  try {
    // Try to get name from context if explicitly provided
    if (context && context.includes('name:')) {
      const nameMatch = context.match(/name:\s*([^\n,]+)/i);
      if (nameMatch) userName = nameMatch[1].trim();
    }
  } catch {
    // Non-fatal — continue without user name
  }

  const startTime = Date.now();

  try {
    let result;

    if (mode === 'custom') {
      result = await runAIPipeline(userInput, stages!);
    } else {
      // Default: deep analysis pipeline
      result = await runDeepAnalysisPipeline({
        userInput,
        userName,
        context,
      });
    }

    const response: Record<string, unknown> = {
      output: result.finalOutput,
      mode,
      totalDurationMs: result.totalDurationMs,
      stagesCompleted: result.stages.length,
      providersUsed: [...new Set(result.stages.map((s) => s.provider))],
    };

    if (includeStageDetails) {
      response.stages = result.stages.map((s) => ({
        stage: s.stage,
        provider: s.provider,
        model: s.model,
        durationMs: s.durationMs,
        outputPreview: s.output.slice(0, 200) + (s.output.length > 200 ? '...' : ''),
      }));
    }

    return NextResponse.json(response);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Pipeline API] Error:', msg);
    return NextResponse.json(
      { error: `Pipeline failed: ${msg}`, totalDurationMs: Date.now() - startTime },
      { status: 500 },
    );
  }
}

// GET — Returns pipeline capabilities and available modes
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/ai/pipeline',
    description: 'Multi-model AI pipeline for deep analysis tasks',
    modes: {
      deep_analysis: {
        description: '4-stage sequential pipeline: parse → analyze → synthesize → recommend',
        stages: ['parse', 'analyze', 'synthesize', 'recommend'],
        useCases: ['Goal decomposition', 'Weekly review insights', 'Habit suggestions', 'Life planning'],
      },
      custom: {
        description: 'Provide your own stage configuration',
        maxStages: 6,
      },
    },
    requestSchema: {
      userInput: 'string (required) — the content to analyze',
      mode: '"deep_analysis" | "custom" (default: deep_analysis)',
      stages: 'PipelineStageConfig[] (required for custom mode)',
      context: 'string (optional) — additional user context',
      includeStageDetails: 'boolean (optional) — include per-stage outputs',
    },
  });
}
