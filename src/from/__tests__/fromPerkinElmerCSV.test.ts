import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromJcamp, toJcamp } from '../../index.js';
import { fromPerkinElmerCSV } from '../fromPerkinElmerCSV.js';

test('fromPerkinElmer', () => {
  const csv = readFileSync(
    join(import.meta.dirname, '../../../testFiles/perkinElmer.csv'),
    'latin1',
  );
  const analysis = fromPerkinElmerCSV(csv);

  const spectrum1 = analysis.getXYSpectrum({ index: 0 });

  expect(spectrum1?.variables.x.data).toHaveLength(8637);
  expect(spectrum1?.variables.y.data).toHaveLength(8637);
  expect(spectrum1?.variables.x.label).toBe('Sample temperature');
  expect(spectrum1?.variables.y.label).toBe('Weight');
  expect(spectrum1?.dataType).toBe('TGA');

  const jcamp = toJcamp(analysis);
  const spectrumCopy = fromJcamp(jcamp).spectra[0];

  expect(spectrumCopy.variables.x.units).toBe('°C');
  expect(spectrumCopy.variables.x.label).toBe('Sample temperature');
  expect(spectrumCopy.variables.y.units).toBe('mg');
  expect(spectrumCopy.variables.y.label).toBe('Weight');

  expect(spectrumCopy.variables.t?.units).toBe('min');
  expect(spectrumCopy.variables.t?.label).toBe('Time');
  expect(spectrumCopy.variables.p?.units).toBe('°C');
  expect(spectrumCopy.variables.p?.label).toBe('Program temperature');
});
