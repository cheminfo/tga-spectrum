import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmer } from '../fromPerkinElmer';

test('fromPerkinElmer', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_tga4000.txt'),
    'latin1',
  );
  let analysis = fromPerkinElmer(jcamp);

  let spectrum1 = analysis.getXYSpectrum();

  expect(spectrum1.variables.x.data).toHaveLength(1155);
  expect(spectrum1.variables.y.data).toHaveLength(1155);
  expect(spectrum1.variables.x.label).toStrictEqual('Temperature [°C]');
  expect(spectrum1.variables.y.label).toStrictEqual('Weight [mg]');
  expect(spectrum1.variables.x.units).toStrictEqual('°C');
  expect(spectrum1.variables.y.units).toStrictEqual('mg');
  expect(spectrum1.meta.methodSteps).toHaveLength(6);

  let spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' });

  expect(spectrum2.variables.x.data).toHaveLength(1155);
  expect(spectrum2.variables.y.data).toHaveLength(1155);
  expect(spectrum2.variables.x.label).toStrictEqual('Time [s]');
  expect(spectrum2.variables.y.label).toStrictEqual('Weight [mg]');
  expect(spectrum2.variables.x.units).toStrictEqual('s');
  expect(spectrum2.variables.y.units).toStrictEqual('mg');
});
