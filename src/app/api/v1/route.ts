import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      goals: {
        'GET /api/v1/goals': 'List all goals',
        'POST /api/v1/goals': 'Create a goal',
      },
      habits: {
        'GET /api/v1/habits': 'List all habits',
        'POST /api/v1/habits/log': 'Log habit completion',
      },
      tasks: {
        'GET /api/v1/tasks': 'List tasks',
        'POST /api/v1/tasks': 'Create a task',
      },
      stats: {
        'GET /api/v1/stats': 'Get productivity stats',
      },
    },
    authentication: 'Pass your API key via the x-api-key header or Authorization: Bearer <key>',
    keyFormat: 'rsg_...',
    rateLimit: '100 requests / hour by default',
    docs: 'https://resurgo.life/docs',
    generated: new Date().toISOString(),
  });
}
