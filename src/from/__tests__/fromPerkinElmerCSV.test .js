import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmerCSV } from '../fromPerkinElmerCSV';
import { toJcamp, fromJcamp } from '../../';

test('fromPerkinElmer', () => {
  let csv = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_csv.txt'),
    'latin1',
  );
  let analysis = fromPerkinElmerCSV(csv);

  let spectrum1 = analysis.getSpectrum({ index: 0 });

  expect(spectrum1.variables.x.data).toHaveLength(8637);
  expect(spectrum1.variables.y.data).toHaveLength(8637);
  expect(spectrum1.variables.x.label).toStrictEqual('Program temperature [°C]');
  expect(spectrum1.variables.y.label).toStrictEqual('Weight [mg]');
  expect(spectrum1.dataType).toBe('TGA');

  let spectrum2 = analysis.getSpectrum({ index: 1 });

  expect(spectrum2.variables.x.data).toHaveLength(8637);
  expect(spectrum2.variables.y.data).toHaveLength(8637);
  expect(spectrum2.variables.x.label).toStrictEqual('Time [s]');
  expect(spectrum2.variables.y.label).toStrictEqual('Weight [mg]');
  expect(spectrum2.dataType).toBe('TGA');

  const jcamp = toJcamp(analysis);
  const spectrumCopy = fromJcamp(jcamp).spectra[0];
  expect(spectrumCopy.variables.x.name).toStrictEqual('Program temperature');
  expect(spectrumCopy.variables.x.units).toStrictEqual('°C');
  expect(spectrumCopy.variables.x.label).toStrictEqual(
    'Program temperature [°C]',
  );
  expect(spectrumCopy.variables.y.name).toStrictEqual('Weight');
  expect(spectrumCopy.variables.y.units).toStrictEqual('mg');
  expect(spectrumCopy.variables.y.label).toStrictEqual('Weight [mg]');

  expect(spectrumCopy.variables.t.name).toStrictEqual('Sample temperature');
  expect(spectrumCopy.variables.t.units).toStrictEqual('°C');
  expect(spectrumCopy.variables.t.label).toStrictEqual(
    'Sample temperature [°C]',
  );
});
