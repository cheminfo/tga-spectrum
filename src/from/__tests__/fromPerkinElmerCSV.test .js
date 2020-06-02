import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmerCSV } from '../fromPerkinElmerCSV';

test('fromPerkinElmer', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_csv.txt'),
    'latin1',
  );
  let result = fromPerkinElmerCSV(jcamp);

  expect(result.get('weightVersusTime').x).toHaveLength(8637);
  expect(result.get('weightVersusTime').y).toHaveLength(8637);
  expect(result.get('weightVersusTime').xLabel).toStrictEqual('Time [s]');
  expect(result.get('weightVersusTime').yLabel).toStrictEqual('Weight [mg]');

  expect(result.get('weightversustemperature').x).toHaveLength(8637);
  expect(result.get('weightversustemperature').y).toHaveLength(8637);
  expect(result.get('weightversustemperature').xLabel).toStrictEqual(
    'Temperature [°C]',
  );
  expect(result.get('weightversustemperature').yLabel).toStrictEqual(
    'Weight [mg]',
  );
});
