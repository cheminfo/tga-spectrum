import { readFileSync } from 'fs';
import { join } from 'path';

import { createSequentialArray } from 'ml-spectra-processing';

import { fromJcamp } from '../../index.js';
import {
  testables,
  reconstructedDecomposition,
} from '../decompositionSteps.js';

const {
  initialize,
  getTotalMassLoss,
  getInitialMassLossGuess,
  peakWidth,
  getInitialWidthEstimates,
  massConservingTemperatureWidths,
  selfConsistentLoop,
} = testables;

let jcamp = readFileSync(
  join(__dirname, '../../../testFiles/tga_double_peak.jdx'),
  'utf8',
);
let analysis = fromJcamp(jcamp);

let spectrum1 = analysis.getXYSpectrum();

//const temperatures = spectrum1.variables.x.data.slice(0, 1600);
const masses = spectrum1.variables.y.data.slice(0, 1600);

test('getTotalMassLoss', () => {
  let res = getTotalMassLoss(masses, 2);
  expect(res).toBeCloseTo(88.87, 1);
});

test('initial mass loss guesses', () => {
  let res = getInitialMassLossGuess(88.87, 2);
  expect(res).toHaveLength(2);
  expect(res[0]).toBeCloseTo(88.87 / 2, 1);
});

test('initial width guess', () => {
  let res = getInitialWidthEstimates([88, 88], [-0.003, -0.03]);
  expect(res).toHaveLength(2);
  expect(res[0]).toBeGreaterThan(res[1]);
});

test('peak width', () => {
  let res = peakWidth(120, -1);
  expect(res).toStrictEqual(120);
});

test('mass conserving widths', () => {
  let res = massConservingTemperatureWidths(
    [100, 100],
    88,
    [0.003, 0.03],
    [{ x: 120 }, { x: 420 }],
  );
  expect(res).toHaveLength(2);
  expect(res[0]).toBeGreaterThan(res[1]);
});

test('initialization', () => {
  const peaks = [
    { x: 120, y: -0.0034 },
    { x: 420, y: -0.0319 },
  ];
  let res = initialize(peaks, masses);
  expect(res).toHaveProperty('firstDerivatives');
  expect(res).toHaveProperty('thirdDerivatives');
  expect(res).toHaveProperty('totalMassLoss');
  expect(res).toHaveProperty('peakWidths');
  expect(res).toHaveProperty('peaks');
  expect(res).toHaveProperty('massLosses');
  expect(res.firstDerivatives).toHaveLength(2);
  expect(res.thirdDerivatives).toHaveLength(2);
  expect(res.peakWidths).toHaveLength(2);
  expect(res.peaks).toHaveLength(2);
  expect(res.massLosses).toHaveLength(2);
});

test('selfConsistentLoop basic sanity check tolerance', () => {
  // tighter tolerance should mean that we need more iterations ...s
  let res0 = selfConsistentLoop(
    [-0.0033999999999999994, -0.0319],
    [1.4707389254528528e-10, 1.2147051839499665e-7],
    [4808.07977807509, 512.4599136506365],
    [44.437034027777905, 44.437034027777905],
    88.87406805555581,
    [
      { x: 120, y: -0.0034 },
      { x: 420, y: -0.0319 },
    ],

    { tolerance: 0.5 },
  );

  let res1 = selfConsistentLoop(
    [-0.004, -0.04],
    [1.4707389254528528e-10, 1.2147051839499665e-7],
    [100, 150],
    [44, 44],
    88.87406805555581,
    [
      { x: 120, y: -0.0034 },
      { x: 420, y: -0.0319 },
    ],

    { tolerance: 0.000001 },
  );
  expect(res1.iteration).toBeGreaterThan(res0.iteration);
});

test('reconstruct decomposition', () => {
  let x = createSequentialArray({ from: 200, to: 500, length: 1000 });
  let res = reconstructedDecomposition(1, [1], [377], [10], x);
  expect(res).toHaveProperty('allTraces');
  expect(res).toHaveProperty('sum');
  expect(res.allTraces).toHaveLength(1);
  expect(res.sum).toHaveLength(1000);
  expect(res.sum[res.sum.length - 1]).toBeCloseTo(0);
});

test('reconstruct decomposition two step', () => {
  let x = createSequentialArray({ from: 200, to: 500, length: 1000 });
  let res = reconstructedDecomposition(1, [0.5, 0.25], [377, 450], [10, 10], x);
  expect(res).toHaveProperty('allTraces');
  expect(res).toHaveProperty('sum');
  expect(res.allTraces).toHaveLength(2);
  expect(res.sum).toHaveLength(1000);
  expect(res.sum[res.sum.length - 1]).toBeCloseTo(0.25);
  expect(res.allTraces[0][999]).toBeCloseTo(0.5);
});
