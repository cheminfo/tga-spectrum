import { describe, expect, it } from 'vitest';

import { fromPerkinElmer } from '../index.js';

describe('tga-spectrum', () => {
  it('fromPerkinElmer', () => {
    expect(typeof fromPerkinElmer).toBe('function');
  });
});
