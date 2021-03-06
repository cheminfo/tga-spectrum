import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp } from '../..';
import { fromNetzsch } from '../fromNetzsch';

test('fromNetzsch', () => {
  let text = readFileSync(join(__dirname, '../../../testFiles/netzsch.txt'));
  let result = fromNetzsch(text);

  expect(result.spectra).toHaveLength(1);
  const spectrum = result.getSpectrum();
  expect(Object.keys(spectrum.variables)).toStrictEqual(['x', 'y', 't']);
  expect(spectrum.variables.x.data[0]).toStrictEqual(27.141);
  expect(spectrum.variables.y.data[0]).toStrictEqual(890.9062668);
  expect(spectrum.variables.x.data).toHaveLength(270);
  expect(spectrum.variables.y.data).toHaveLength(270);
  expect(spectrum.variables.t.data).toHaveLength(270);
  let jcamp = toJcamp(result);
  expect(jcamp.length).toBeGreaterThan(7500);
  expect(jcamp.length).toBeLessThan(9200);
});
