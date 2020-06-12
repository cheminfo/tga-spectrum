import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/jcamp.jdx'),
    'utf8',
  );
  let analysis = fromJcamp(jcamp);

  let spectrum1 = analysis.getSpectrum({ index: 0 });

  expect(spectrum1.x).toHaveLength(2251);
  expect(spectrum1.y).toHaveLength(2251);
  expect(spectrum1.xLabel).toStrictEqual('Ts [°C]');
  expect(spectrum1.yLabel).toStrictEqual('Value [mg]');

  let spectrum2 = analysis.getSpectrum({ index: 1 });

  expect(spectrum2.x).toHaveLength(2251);
  expect(spectrum2.y).toHaveLength(2251);
  expect(spectrum2.xLabel).toStrictEqual('t [s]');
  expect(spectrum2.yLabel).toStrictEqual('Value [mg]');
});
