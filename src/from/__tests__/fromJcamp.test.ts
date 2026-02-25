import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromJcamp } from '../../index.ts';

test('fromJcamp', () => {
  const jcamp = readFileSync(
    join(import.meta.dirname, './data/jcamp.jdx'),
    'utf8',
  );
  const analysis = fromJcamp(jcamp);

  const spectrum1 = analysis.getXYSpectrum();

  expect(spectrum1).toBeDefined();

  expect(spectrum1?.variables.x.data).toHaveLength(2251);
  expect(spectrum1?.variables.y.data).toHaveLength(2251);
  expect(spectrum1?.variables.x.label).toBe('Ts');
  expect(spectrum1?.variables.x.units).toBe('°C');
  expect(spectrum1?.variables.y.label).toBe('Value');
  expect(spectrum1?.variables.y.units).toBe('mg');

  const spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' });

  expect(spectrum2?.variables.x.data).toHaveLength(2251);
  expect(spectrum2?.variables.y.data).toHaveLength(2251);
  expect(spectrum2?.variables.x.label).toBe('t');
  expect(spectrum2?.variables.y.label).toBe('Value');
});
