import { readFileSync } from 'fs';
import { join } from 'path';

import { fromTAInstruments } from '../fromTAInstruments';

test('fromTAInstruments', () => {
  let file = readFileSync(
    join(__dirname, '../../../testFiles/TAInstruments.txt'),
    'utf16le',
  );

  const analysis = fromTAInstruments(file);
  const spectra = analysis.getSpectra();

  expect(spectra[0].meta.sampleName).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[0].title).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[0].variables.x.data[0]).toStrictEqual(1);
  expect(spectra[0].variables.x.data).toHaveLength(15580);
  expect(spectra[0].variables.x.data[15579]).toStrictEqual(25.00298);
  expect(spectra[0].variables.y.data).toHaveLength(15580);
  expect(spectra[0].meta.methodSteps).toHaveLength(10);

  expect(spectra[1].meta.sampleName).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[1].title).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[1].variables.x.data).toHaveLength(15580);
  expect(spectra[1].variables.x.data[15579]).toStrictEqual(-1);
  expect(spectra[1].variables.y.data).toHaveLength(15580);
  expect(spectra[1].meta.methodSteps).toHaveLength(10);
});
