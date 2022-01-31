import { fromPerkinElmer } from '..';

describe('tga-spectrum', () => {
  it('fromPerkinElmer', () => {
    expect(typeof fromPerkinElmer).toBe('function');
  });
});
