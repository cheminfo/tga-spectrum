import { readFileSync } from 'fs';
import { join } from 'path';

import { fromSIV, fromJcamp } from '..';

test('load / save jcamp', () => {
  let text = readFileSync(join(__dirname, '../../testFiles/test.sIv'), 'utf8');
  let spectra = fromSIV(text);
  let jcamp = spectra[0].toJcamp();
  let spectrum = fromJcamp(jcamp);
  let jcamp2 = spectrum.toJcamp();
  expect(jcamp).toBe(jcamp2);
});
