import { detectIntent } from '@/lib/ascend-knowledge-base';
import { CHATBOT_EVAL_SET } from '@/lib/chatbot-eval-set';

describe('chatbot regression intent suite', () => {
  it('meets intent classification quality threshold on canonical prompts', () => {
    const total = CHATBOT_EVAL_SET.length;
    let correct = 0;

    for (const testCase of CHATBOT_EVAL_SET) {
      const predicted = detectIntent(testCase.prompt);
      if (predicted === testCase.expectedIntent) {
        correct += 1;
      }
    }

    const accuracy = (correct / total) * 100;

    // Keep a stable bar and watch this weekly for regressions/drift.
    expect(accuracy).toBeGreaterThanOrEqual(80);
  });
});
