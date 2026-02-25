import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromPerkinElmer } from '../fromPerkinElmer.ts';

test('fromPerkinElmer', () => {
  const text = readFileSync(
    join(
      import.meta.dirname,
      '../parser/__tests__/data/tga/perkinElmer_tga4000.txt',
    ),
  );
  const analysis = fromPerkinElmer(text);
  const spectrum1 = analysis.getXYSpectrum();

  expect(spectrum1).toBeDefined();
  expect(spectrum1?.variables.x.data).toHaveLength(1155);
  expect(spectrum1?.variables.y.data).toHaveLength(1155);
  expect(spectrum1?.variables.x.label).toBe('Temperature');
  expect(spectrum1?.variables.y.label).toBe('Weight');
  expect(spectrum1?.variables.x.units).toBe('°C');
  expect(spectrum1?.variables.y.units).toBe('mg');

  expect(spectrum1?.meta?.methodSteps).toStrictEqual([
    '1) Hold for 1.0 min at 50.00�C',
    '2) Heat from 50.00�C to 700.00�C at 40.00�C/min',
    '3) Hold for 2.0 min at 700.00�C',
  ]);

  const spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' });

  expect(spectrum2?.variables.x.data).toHaveLength(1155);
  expect(spectrum2?.variables.y.data).toHaveLength(1155);
  expect(spectrum2?.variables.x.label).toBe('Time');
  expect(spectrum2?.variables.y.label).toBe('Weight');
  expect(spectrum2?.variables.x.units).toBe('s');
  expect(spectrum2?.variables.y.units).toBe('mg');
});
