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

  expect(spectrum1.variables.x.data).toHaveLength(408);
  expect(spectrum1.variables.y.data).toHaveLength(408);
  expect(spectrum1.variables.t.data).toHaveLength(408);
  expect(spectrum1.variables.x.label).toStrictEqual('Temperature [°C]');
  expect(spectrum1.variables.y.label).toStrictEqual('Weight [mg]');
  expect(spectrum1.variables.t.label).toStrictEqual('Time [s]');
});
