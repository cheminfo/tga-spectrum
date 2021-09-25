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
  // @ts-expect-error
  expect(spectrum.variables.x.data).toHaveLength(408);
  // @ts-expect-error
  expect(spectrum.variables.y.data).toHaveLength(408);
  // @ts-expect-error
  expect(spectrum.variables.x.label).toStrictEqual('Temperature');
  // @ts-expect-error
  expect(spectrum.variables.y.label).toStrictEqual('Weight');
});
