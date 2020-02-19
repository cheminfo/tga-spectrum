import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmer } from '../fromPerkinElmer';

test('fromPerkinElmer', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/tga4000_perkinElmer.txt'),
    'latin1',
  );
  let result = fromPerkinElmer(jcamp);

  expect(result.get('weightVersusTime').x).toHaveLength(1155);
  expect(result.get('weightVersusTime').y).toHaveLength(1155);
  expect(result.get('weightVersusTime').xLabel).toStrictEqual('Time [s]');
  expect(result.get('weightVersusTime').yLabel).toStrictEqual('Weight [mg]');

  expect(result.get('weightversustemperature').x).toHaveLength(1155);
  expect(result.get('weightversustemperature').y).toHaveLength(1155);
  expect(result.get('weightversustemperature').xLabel).toStrictEqual(
    'Temperature [°C]',
  );
  expect(result.get('weightversustemperature').yLabel).toStrictEqual(
    'Weight [mg]',
  );
});
