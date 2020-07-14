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
  expect(spectra[0].variables.x.data[0]).toStrictEqual(22.70189);
  expect(spectra[0].variables.x.data).toHaveLength(15577);
  expect(spectra[0].variables.x.data[15576]).toStrictEqual(25.00298);
  expect(spectra[0].variables.y.data).toHaveLength(15577);
  expect(spectra[0].meta.methodSteps).toHaveLength(10);

  expect(spectra[1].meta.sampleName).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[1].title).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[1].variables.x.data).toHaveLength(15577);
  expect(spectra[1].variables.x.data[15576]).toStrictEqual(129.7958);
  expect(spectra[1].variables.y.data).toHaveLength(15577);
  expect(spectra[1].meta.methodSteps).toHaveLength(10);
});
