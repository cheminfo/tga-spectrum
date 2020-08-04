import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/ntuples.jdx'),
    'utf8',
  );
  let analysis = fromJcamp(jcamp);

  let spectrum = analysis.getXYSpectrum();

  expect(spectrum.variables.x.data).toHaveLength(408);
  expect(spectrum.variables.y.data).toHaveLength(408);
  expect(spectrum.variables.x.label).toStrictEqual('Temperature [°C]');
  expect(spectrum.variables.y.label).toStrictEqual('Weight [mg]');
});
