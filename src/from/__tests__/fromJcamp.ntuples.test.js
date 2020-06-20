import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/ntuples.jdx'),
    'utf8',
  );
  let analysis = fromJcamp(jcamp);

  let spectrum1 = analysis.getSpectrum({ index: 0 });

  expect(spectrum1.x).toHaveLength(408);
  expect(spectrum1.y).toHaveLength(408);
  expect(spectrum1.xLabel).toStrictEqual('Temperature [°C]');
  expect(spectrum1.yLabel).toStrictEqual('Weight [mg]');
});
