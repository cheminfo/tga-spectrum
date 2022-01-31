import { readFileSync } from 'fs';
import { join } from 'path';

import { Spectrum } from 'common-spectrum';

import { fromPerkinElmer } from '../fromPerkinElmer';

test('fromPerkinElmer', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_tga4000.txt'),
    'latin1',
  );
  let analysis = fromPerkinElmer(jcamp);

  let spectrum1 = analysis.getXYSpectrum() as Spectrum;
  expect(spectrum1).toBeDefined();
  expect(spectrum1.variables.x.data).toHaveLength(1155);
  expect(spectrum1.variables.y.data).toHaveLength(1155);
  expect(spectrum1.variables.x.label).toStrictEqual('Temperature');
  expect(spectrum1.variables.y.label).toStrictEqual('Weight');
  expect(spectrum1.variables.x.units).toStrictEqual('°C');
  expect(spectrum1.variables.y.units).toStrictEqual('mg');
  // @ts-expect-error
  expect(spectrum1.meta.methodSteps).toHaveLength(6);

  let spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' }) as Spectrum;

  expect(spectrum2.variables.x.data).toHaveLength(1155);
  expect(spectrum2.variables.y.data).toHaveLength(1155);
  expect(spectrum2.variables.x.label).toStrictEqual('Time');
  expect(spectrum2.variables.y.label).toStrictEqual('Weight');
  expect(spectrum2.variables.x.units).toStrictEqual('s');
  expect(spectrum2.variables.y.units).toStrictEqual('mg');
});
