import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmer } from '../fromPerkinElmer';

test('fromPerkinElmer', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_tga4000.txt'),
    'latin1',
  );
  let analysis = fromPerkinElmer(jcamp);

  let spectrum1 = analysis.getSpectrum();

  expect(spectrum1.x).toHaveLength(1155);
  expect(spectrum1.y).toHaveLength(1155);
  expect(spectrum1.xLabel).toStrictEqual('Temperature [°C]');
  expect(spectrum1.yLabel).toStrictEqual('Weight [mg]');
  expect(spectrum1.xUnits).toStrictEqual('°C');
  expect(spectrum1.yUnits).toStrictEqual('mg');

  let spectrum2 = analysis.getSpectrum({ flavor: 'mg vs s' });

  expect(spectrum2.x).toHaveLength(1155);
  expect(spectrum2.y).toHaveLength(1155);
  expect(spectrum2.xLabel).toStrictEqual('Time [s]');
  expect(spectrum2.yLabel).toStrictEqual('Weight [mg]');
  expect(spectrum2.xUnits).toStrictEqual('s');
  expect(spectrum2.yUnits).toStrictEqual('mg');
});
