import { readFileSync } from 'fs';
import { join } from 'path';

import { fromNetzsch } from '../fromNetzsch';

test('fromNetzsch', () => {
  let file = readFileSync(
    join(__dirname, '../../../testFiles/TGA_AlPyr_ELN.txt'),
    'latin1',
  );
  const analysis = fromNetzsch(file);
  let spectrum1 = analysis.getXYSpectrum();
  expect(spectrum1.variables.x.data).toHaveLength(270);
  expect(spectrum1.variables.x.data[0]).toStrictEqual(27.141);
  expect(spectrum1.variables.y.data[0]).toStrictEqual(890.9062668);
  expect(spectrum1.variables.x.data[269]).toStrictEqual(699.641);
});
