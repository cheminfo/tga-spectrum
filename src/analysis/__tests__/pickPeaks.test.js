import { readFileSync } from 'fs';
import { join } from 'path';

import { createSequentialArray } from 'ml-spectra-processing';

import { fromJcamp } from '../../index.js';
import { reconstructedDecomposition } from '../decompositionSteps.js';
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
  expect(Math.abs(res[1].x - 113)).toBeLessThan(5);
  expect(Math.abs(res[0].x - 415)).toBeLessThan(5);
});

test('simulated single step', () => {
  let x = createSequentialArray({ from: 200, to: 500, length: 1000 });
  let mass = reconstructedDecomposition(1, [1], [377], [10], x);
  let peaks = findPeaks(x, mass.sum);
  expect(Math.abs(peaks[0].x - 377)).toBeLessThan(5);
  expect(Math.abs(peaks[0].width - 10)).toBeLessThan(10);
});

test('simulated double step', () => {
  let x = createSequentialArray({ from: 200, to: 500, length: 1000 });
  let mass = reconstructedDecomposition(
    1,
    [0.5, 0.25],
    [377, 450],
    [10, 10],
    x,
  );
  let peaks = findPeaks(x, mass.sum);
  console.log(peaks);
  expect(peaks).toHaveLength(2);
  expect(Math.abs(peaks[0].x - 377)).toBeLessThan(5);
  expect(Math.abs(peaks[0].width - 10)).toBeLessThan(10);
});
