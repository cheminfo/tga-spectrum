import { readFileSync } from 'fs';
import { join } from 'path';

import { Spectrum } from 'common-spectrum';

import { fromPerkinElmer } from '../fromPerkinElmer';

test('fromPerkinElmer', () => {
  const jcamp = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_tga4000.txt'),
    'latin1',
  );
  const analysis = fromPerkinElmer(jcamp);

  const spectrum1 = analysis.getXYSpectrum() as Spectrum;
  expect(spectrum1).toBeDefined();
  expect(spectrum1.variables.x.data).toHaveLength(1155);
  expect(spectrum1.variables.y.data).toHaveLength(1155);
  expect(spectrum1.variables.x.label).toBe('Temperature');
  expect(spectrum1.variables.y.label).toBe('Weight');
  expect(spectrum1.variables.x.units).toBe('°C');
  expect(spectrum1.variables.y.units).toBe('mg');
  expect(spectrum1.meta?.methodSteps).toHaveLength(6);

  const spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' }) as Spectrum;

  expect(spectrum2.variables.x.data).toHaveLength(1155);
  expect(spectrum2.variables.y.data).toHaveLength(1155);
  expect(spectrum2.variables.x.label).toBe('Time');
  expect(spectrum2.variables.y.label).toBe('Weight');
  expect(spectrum2.variables.x.units).toBe('s');
  expect(spectrum2.variables.y.units).toBe('mg');
});
