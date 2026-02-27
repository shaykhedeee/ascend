import { readFileSync } from 'fs';
import { describe, it, expect } from '@jest/globals';

describe('Billing archive schema & API surface', () => {
  it('schema defines archivedByDowngrade on habits and goals', () => {
    const schema = readFileSync('convex/schema.ts', 'utf8');
    expect(schema).toMatch(/archivedByDowngrade: v.optional\(v.boolean\(\)\)/);
    expect(schema).toMatch(/by_userId_archivedByDowngrade/);
  });

  it('convex/habits.ts exposes listArchivedByDowngrade and getArchivedDowngradeCount', () => {
    const habits = readFileSync('convex/habits.ts', 'utf8');
    expect(habits).toMatch(/export const listArchivedByDowngrade = query/);
    expect(habits).toMatch(/export const getArchivedDowngradeCount = query/);
    expect(habits).toMatch(/export const restoreArchivedOnUpgrade = mutation/);
  });

  it('convex/goals.ts exposes listArchivedByDowngrade and getArchivedDowngradeCount', () => {
    const goals = readFileSync('convex/goals.ts', 'utf8');
    expect(goals).toMatch(/export const listArchivedByDowngrade = query/);
    expect(goals).toMatch(/export const getArchivedDowngradeCount = query/);
    expect(goals).toMatch(/export const restoreArchivedOnUpgrade = mutation/);
  });
});
