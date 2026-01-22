import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromPerkinElmer } from '../fromPerkinElmer.js';

test('fromPerkinElmer', () => {
  const jcamp = readFileSync(
    join(import.meta.dirname, '../../../testFiles/perkinElmer_tga4000.txt'),
    'latin1',
  );
  const analysis = fromPerkinElmer(jcamp);

  const spectrum1 = analysis.getXYSpectrum();

  expect(spectrum1).toBeDefined();
  expect(spectrum1?.variables.x.data).toHaveLength(1155);
  expect(spectrum1?.variables.y.data).toHaveLength(1155);
  expect(spectrum1?.variables.x.label).toBe('Temperature');
  expect(spectrum1?.variables.y.label).toBe('Weight');
  expect(spectrum1?.variables.x.units).toBe('°C');
  expect(spectrum1?.variables.y.units).toBe('mg');
  expect(spectrum1?.meta?.methodSteps).toHaveLength(6);

  const spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' });

  expect(spectrum2?.variables.x.data).toHaveLength(1155);
  expect(spectrum2?.variables.y.data).toHaveLength(1155);
  expect(spectrum2?.variables.x.label).toBe('Time');
  expect(spectrum2?.variables.y.label).toBe('Weight');
  expect(spectrum2?.variables.x.units).toBe('s');
  expect(spectrum2?.variables.y.units).toBe('mg');
});
