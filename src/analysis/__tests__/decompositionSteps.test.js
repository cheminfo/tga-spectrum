import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../../index.js';
import { testables } from '../decompositionSteps.js';

const { findPeaks } = testables;

let jcamp = readFileSync(
  join(__dirname, '../../../testFiles/jcamp.jdx'),
  'utf8',
);
let analysis = fromJcamp(jcamp);

let spectrum1 = analysis.getXYSpectrum();

const temperatures = spectrum1.variables.x.data.slice(0, 1600);
const masses = spectrum1.variables.y.data.slice(0, 1600);
test('findPeaks', () => {
  let res = findPeaks(temperatures, masses);
  console.log(res);
});
