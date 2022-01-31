import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp, fromJcamp } from '../..';
import { fromPerkinElmerCSV } from '../fromPerkinElmerCSV';

test('fromPerkinElmer', () => {
  let csv = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer.csv'),
    'latin1',
  );
  let analysis = fromPerkinElmerCSV(csv);

  let spectrum1 = analysis.getXYSpectrum({ index: 0 });

  // @ts-expect-error
  expect(spectrum1.variables.x.data).toHaveLength(8637);
  // @ts-expect-error
  expect(spectrum1.variables.y.data).toHaveLength(8637);
  // @ts-expect-error
  expect(spectrum1.variables.x.label).toBe('Sample temperature');
  // @ts-expect-error
  expect(spectrum1.variables.y.label).toBe('Weight');
  // @ts-expect-error
  expect(spectrum1.dataType).toBe('TGA');

  const jcamp = toJcamp(analysis);
  const spectrumCopy = fromJcamp(jcamp).spectra[0];
  expect(spectrumCopy.variables.x.units).toBe('°C');
  expect(spectrumCopy.variables.x.label).toBe('Sample temperature');
  expect(spectrumCopy.variables.y.units).toBe('mg');
  expect(spectrumCopy.variables.y.label).toBe('Weight');

  // @ts-expect-error
  expect(spectrumCopy.variables.t.units).toBe('min');
  // @ts-expect-error
  expect(spectrumCopy.variables.t.label).toBe('Time');

  // @ts-expect-error
  expect(spectrumCopy.variables.p.units).toBe('°C');
  // @ts-expect-error
  expect(spectrumCopy.variables.p.label).toBe('Program temperature');
});
