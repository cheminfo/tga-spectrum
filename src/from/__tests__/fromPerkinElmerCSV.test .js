import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmerCSV } from '../fromPerkinElmerCSV';

test('fromPerkinElmer', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_csv.txt'),
    'latin1',
  );
  let analysis = fromPerkinElmerCSV(jcamp);

  let spectrum1 = analysis.getSpectrum({ index: 0 });

  expect(spectrum1.x).toHaveLength(8637);
  expect(spectrum1.y).toHaveLength(8637);
  expect(spectrum1.xLabel).toStrictEqual('Temperature [°C]');
  expect(spectrum1.yLabel).toStrictEqual('Weight [mg]');

  let spectrum2 = analysis.getSpectrum({ index: 1 });

  expect(spectrum2.x).toHaveLength(8637);
  expect(spectrum2.y).toHaveLength(8637);
  expect(spectrum2.xLabel).toStrictEqual('Time [s]');
  expect(spectrum2.yLabel).toStrictEqual('Weight [mg]');
});
