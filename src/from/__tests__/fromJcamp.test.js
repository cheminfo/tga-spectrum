import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/jcamp.jdx'),
    'utf8',
  );
  let analysis = fromJcamp(jcamp);

  let spectrum1 = analysis.getXYSpectrum();

  expect(spectrum1.variables.x.data).toHaveLength(2251);
  expect(spectrum1.variables.y.data).toHaveLength(2251);
  expect(spectrum1.variables.x.label).toStrictEqual('Ts [°C]');
  expect(spectrum1.variables.y.label).toStrictEqual('Value [mg]');

  let spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' });

  expect(spectrum2.variables.x.data).toHaveLength(2251);
  expect(spectrum2.variables.y.data).toHaveLength(2251);
  expect(spectrum2.variables.x.label).toStrictEqual('t [s]');
  expect(spectrum2.variables.y.label).toStrictEqual('Value [mg]');
});
