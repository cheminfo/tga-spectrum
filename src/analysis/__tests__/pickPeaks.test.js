import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../../index.js';
import { findPeaks } from '../pickPeaks.js';

let jcamp = readFileSync(
  join(__dirname, '../../../testFiles/tga_double_peak.jdx'),
  'utf8',
);
let analysis = fromJcamp(jcamp);

let spectrum1 = analysis.getXYSpectrum();

const temperatures = spectrum1.variables.x.data.slice(0, 1600);
const masses = spectrum1.variables.y.data.slice(0, 1600);
test('findPeaks', () => {
  let res = findPeaks(temperatures, masses);
  expect(res).toHaveLength(2);
  expect(Math.abs(res[0].x - 120)).toBeLessThan(5);
  expect(Math.abs(res[1].x - 420)).toBeLessThan(5);
});
