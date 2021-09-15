import { fromPerkinElmer } from '..';

describe('tga-spectrum', () => {
  it('fromPerkinElmer', () => {
    expect(typeof fromPerkinElmer).toStrictEqual('function');
  });
});
