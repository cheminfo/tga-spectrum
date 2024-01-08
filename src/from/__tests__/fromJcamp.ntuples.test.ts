import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  const jcamp = readFileSync(
    join(__dirname, '../../../testFiles/ntuples.jdx'),
    'utf8',
  );
  const analysis = fromJcamp(jcamp);

  const spectrum = analysis.getXYSpectrum();
  expect(spectrum?.variables.x.data).toHaveLength(408);
  expect(spectrum?.variables.y.data).toHaveLength(408);
  expect(spectrum?.variables.x.label).toBe('Temperature');
  expect(spectrum?.variables.y.label).toBe('Weight');
});
