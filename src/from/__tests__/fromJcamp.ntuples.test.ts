import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromJcamp } from '../../index.ts';

test('fromJcamp', () => {
  const jcamp = readFileSync(
    join(import.meta.dirname, './data/ntuples.jdx'),
    'utf8',
  );
  const analysis = fromJcamp(jcamp);

  const spectrum = analysis.getXYSpectrum();

  expect(spectrum?.variables.x.data).toHaveLength(408);
  expect(spectrum?.variables.y.data).toHaveLength(408);
  expect(spectrum?.variables.x.label).toBe('Temperature');
  expect(spectrum?.variables.y.label).toBe('Weight');
});
