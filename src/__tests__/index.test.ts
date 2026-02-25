import { expect, test } from 'vitest';

import { fromPerkinElmer } from '../index.ts';

test('fromPerkinElmer', () => {
  expect(typeof fromPerkinElmer).toBe('function');
});
