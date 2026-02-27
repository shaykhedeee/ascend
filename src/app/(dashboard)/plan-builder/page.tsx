'use client';

import { useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, FormEvent } from 'react';
import { Map, Zap, ChevronRight, CheckCircle, Circle, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
  estimatedDays: number;
  subTasks: string[];
  phase: string;
}

interface Plan {
  goal: string;
  overview: string;
  totalDuration: string;
  phases: Step[];
}

export default function PlanBuilderPage() {
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);

  const [goalTitle, setGoalTitle] = useState('');
  const [goalContext, setGoalContext] = useState('');
  const [coachType, setCoachType] = useState<'TITAN' | 'NOVA' | 'SAGE' | 'PHOENIX'>('NOVA');
  const [building, setBuilding] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const COACHES = [
    { id: 'NOVA' as const, label: 'NOVA', desc: 'Productivity Scientist — systematic, efficient' },
    { id: 'TITAN' as const, label: 'TITAN', desc: 'Business Strategist — revenue-focused' },
    { id: 'SAGE' as const, label: 'SAGE', desc: 'Life Architect — purpose-aligned' },
    { id: 'PHOENIX' as const, label: 'PHOENIX', desc: 'Comeback Coach — rebuilding focus' },
  ];

  const handleBuild = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || building) return;
    setBuilding(true);
    setPlan(null);

    const prompt = `BUILD A DETAILED PLAN for this goal: "${goalTitle}"
${goalContext ? `Additional context: ${goalContext}` : ''}

Create a structured, unique, actionable plan broken into phases (not generic). Each phase should have:
- Specific phase name
- Clear description
- Estimated duration in days
- 3-5 specific sub-tasks (concrete actions, not vague)

RESPOND WITH ONLY A VALID JSON OBJECT in this exact format:
{
  "goal": "${goalTitle}",
  "overview": "Brief overview sentence",
  "totalDuration": "X weeks/months",
  "phases": [
    {
      "title": "Phase 1 name",
      "description": "What this phase accomplishes",
      "estimatedDays": 7,
      "phase": "Phase 1",
      "subTasks": ["Specific task 1", "Specific task 2", "Specific task 3"]
    }
  ]
}

Make it realistic, specific to THIS goal (not generic), and include 4-6 phases.`;

    try {
      const response = await sendWithPersona({
        content: prompt,
        coachId: coachType,
      });

      const jsonMatch = response.reply?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed: Plan = JSON.parse(jsonMatch[0]);
        setPlan(parsed);
      } else {
        // Fallback plan structure if parsing fails
        setPlan({
          goal: goalTitle,
          overview: (response.reply ?? '').slice(0, 200),
          totalDuration: '6-8 weeks',
          phases: [
            {
              phase: 'Phase 1',
              title: 'Foundation & Research',
              description: 'Establish the groundwork and gather necessary information',
              estimatedDays: 7,
              subTasks: ['Define success criteria clearly', 'Research existing solutions/competition', 'List all required resources', 'Set up tracking system'],
            },
            {
              phase: 'Phase 2',
              title: 'Planning & Design',
              description: 'Create detailed plans and designs before execution',
              estimatedDays: 7,
              subTasks: ['Create detailed roadmap', 'Break down into weekly milestones', 'Identify potential blockers', 'Define first action to take'],
            },
            {
              phase: 'Phase 3',
              title: 'Execution — Sprint 1',
              description: 'Begin active work on the first major deliverable',
              estimatedDays: 14,
              subTasks: ['Execute first high-priority task', 'Daily progress check-in', 'Adjust plan based on learnings', 'Complete milestone 1'],
            },
            {
              phase: 'Phase 4',
              title: 'Review & Optimize',
              description: 'Evaluate progress, fix issues, optimize approach',
              estimatedDays: 7,
              subTasks: ['Review what is working', 'Eliminate non-essential tasks', 'Focus on 20% that creates 80% of results', 'Set next phase goals'],
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBuilding(false);
    }
  };

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const totalPhases = plan?.phases.length ?? 0;
  const completedCount = completedSteps.size;
  const overallProgress = totalPhases > 0 ? Math.round((completedCount / totalPhases) * 100) : 0;

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">AI_MODULE :: PLAN_BUILDER_v2</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Plan Builder</h1>
            <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">AI-powered goal decomposition — unique plans for every goal</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">GOAL_INPUT</span>
          </div>
          <form onSubmit={handleBuild} className="p-4 space-y-3">
            <input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="What's your big goal? (e.g., Launch my SaaS, Lose 20lbs, Write a book)" required
              className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
            <textarea value={goalContext} onChange={(e) => setGoalContext(e.target.value)}
              placeholder="Extra context (current situation, constraints, resources available)..." rows={3}
              className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
            <div>
              <p className="mb-2 font-mono text-[9px] tracking-widest text-zinc-400">COACH_PERSPECTIVE</p>
              <div className="grid grid-cols-2 gap-1.5">
                {COACHES.map(({ id, label, desc }) => (
                  <button key={id} type="button" onClick={() => setCoachType(id)}
                    className={cn('border p-2.5 text-left transition',
                      coachType === id ? 'border-orange-800 bg-orange-950/20' : 'border-zinc-800 hover:border-zinc-700'
                    )}>
                    <p className={cn('font-mono text-[10px] font-bold tracking-widest', coachType === id ? 'text-orange-500' : 'text-zinc-400')}>{label}</p>
                    <p className="font-mono text-[8px] text-zinc-400">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={building || !goalTitle.trim()}
              className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-6 py-2.5 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
              <Zap className="h-3.5 w-3.5" />
              {building ? 'BUILDING_PLAN_' : '[BUILD_MY_PLAN]'}
            </button>
          </form>
        </div>

        {/* Loading */}
        {building && (
          <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-600" />
            <p className="font-mono text-xs tracking-widest text-zinc-500">ANALYZING_GOAL_CONTEXT_</p>
            <p className="mt-1 font-mono text-[9px] text-zinc-400">Building a unique plan tailored to your situation...</p>
          </div>
        )}

        {/* Plan Output */}
        {plan && !building && (
          <div className="space-y-4">
            {/* Plan Overview */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">PLAN_GENERATED</span>
              </div>
              <div className="p-4">
                <p className="font-mono text-sm font-bold text-orange-500">{plan.goal}</p>
                <p className="mt-1.5 font-mono text-xs leading-relaxed text-zinc-400">{plan.overview}</p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="font-mono text-[9px] text-zinc-500">DURATION: <span className="text-zinc-300">{plan.totalDuration}</span></span>
                  <span className="font-mono text-[9px] text-zinc-500">PHASES: <span className="text-zinc-300">{totalPhases}</span></span>
                  <span className="font-mono text-[9px] text-zinc-500">PROGRESS: <span className="text-orange-500">{overallProgress}%</span></span>
                </div>
                <div className="mt-2 h-1 w-full bg-zinc-900">
                  <div className="h-1 bg-orange-600 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
                </div>
              </div>
            </div>

            {/* Phases */}
            {plan.phases.map((step, i) => {
              const done = completedSteps.has(i);
              return (
                <div key={i} className={cn('border bg-zinc-950 transition', done ? 'border-green-900/50 opacity-80' : 'border-zinc-900')}>
                  <div className="flex items-start gap-3 p-4">
                    <button onClick={() => toggleStep(i)} className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-zinc-400 hover:text-zinc-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] tracking-widest text-zinc-400">{step.phase}</span>
                        <ChevronRight className="h-3 w-3 text-zinc-400" />
                        <span className={cn('font-mono text-sm font-bold', done ? 'text-green-500 line-through' : 'text-zinc-200')}>
                          {step.title}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-zinc-500">{step.description}</p>
                      <p className="mt-0.5 font-mono text-[9px] text-zinc-400">~{step.estimatedDays} days</p>
                      <ul className="mt-2 space-y-1">
                        {step.subTasks.map((task, j) => (
                          <li key={j} className="flex items-start gap-1.5">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-orange-600" />
                            <span className="font-mono text-[11px] text-zinc-400">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Rebuild */}
            <button onClick={() => { setPlan(null); setCompletedSteps(new Set()); }}
              className="w-full border border-dashed border-zinc-800 py-3 font-mono text-[10px] tracking-widest text-zinc-400 transition hover:border-orange-800 hover:text-orange-600">
              [REBUILD_PLAN]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
