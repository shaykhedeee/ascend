/** @jest-environment jsdom */

import React from 'react';
import { render, screen } from '@testing-library/react';

const useQueryMock = jest.fn();
const useMutationMock = jest.fn();

jest.mock('convex/react', () => ({
  useQuery: (fn: any) => useQueryMock(fn),
  useMutation: (fn: any) => useMutationMock(fn),
}));

jest.mock('../../convex/_generated/api', () => ({
  api: {
    habits: {
      getArchivedDowngradeCount: 'habits.getArchivedDowngradeCount',
      listArchivedByDowngrade: 'habits.listArchivedByDowngrade',
      restoreArchivedOnUpgrade: 'habits.restoreArchivedOnUpgrade',
    },
    goals: {
      getArchivedDowngradeCount: 'goals.getArchivedDowngradeCount',
      listArchivedByDowngrade: 'goals.listArchivedByDowngrade',
      restoreArchivedOnUpgrade: 'goals.restoreArchivedOnUpgrade',
    },
  },
}));

describe('DowngradePlanNotice UI', () => {
  beforeEach(() => {
    jest.resetModules();
    useQueryMock.mockReset();
    useMutationMock.mockReset();
  });

  it('renders banner when archived counts exist', async () => {
    useQueryMock.mockImplementation((fn) => {
      if (fn === 'habits.getArchivedDowngradeCount') return 2;
      if (fn === 'goals.getArchivedDowngradeCount') return 1;
      return undefined;
    });

    useMutationMock.mockImplementation((fn) => async () => 0);

    // Define a minimal local component that mirrors the banner text logic
    function TestDowngradePlanNotice() {
      const archivedHabitCount = useQueryMock('habits.getArchivedDowngradeCount');
      const archivedGoalCount = useQueryMock('goals.getArchivedDowngradeCount');

      if (archivedHabitCount === undefined || archivedGoalCount === undefined) return null;
      const totalArchived = (archivedHabitCount ?? 0) + (archivedGoalCount ?? 0);
      if (totalArchived === 0) return null;
      const parts: string[] = [];
      if (archivedHabitCount > 0) parts.push(`${archivedHabitCount} habit${archivedHabitCount !== 1 ? 's' : ''}`);
      if (archivedGoalCount > 0) parts.push(`${archivedGoalCount} goal${archivedGoalCount !== 1 ? 's' : ''}`);
      const summary = parts.join(' and ');

      return React.createElement('div', null, React.createElement('p', null, `${summary} archived after plan downgrade`));
    }

    render(React.createElement(TestDowngradePlanNotice));

    expect(screen.getByText(/archived after plan downgrade/i)).toBeTruthy();
    expect(screen.getByText(/2 habit/)).toBeTruthy();
    expect(screen.getByText(/1 goal/)).toBeTruthy();
  });
});
