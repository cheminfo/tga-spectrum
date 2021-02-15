/*Implements automatic TGA analysis following 10.1002/fam.2849*/
import mean from 'ml-array-mean';
import {
  xFindClosestIndex,
  xMeanAbsoluteError,
  xDotProduct,
  xSubtract,
  xMultiply,
  xAdd,
} from 'ml-spectra-processing';

const R = 8.313;
/**
 * Eq. 5 in 10.1002/fam.2849
 *
 * @param {Number} massPeak m(Tp)
 * @param {Number} derivativePeak m'(Tp)
 * @returns{Number}
 */
function peakWidth(massPeak, derivativePeak) {
  return -massPeak / derivativePeak;
}

/**
 * Eq. 12 in 10.1002/fam.2849 without m0
 *
 * @param {Number} temp
 * @param {Number} tempPeak
 * @param {Number} peakWidth
 * @returns {Number}
 */
function peak(temp, tempPeak, peakWidth) {
  return Math.exp(-Math.exp((temp - tempPeak) / peakWidth));
}

function getBeta(times, temperatures, startTemperature, endTemperature) {
  //in first approximation we can take it constant, but we can also make a linearity approx within a range
  let startIndex = xFindClosestIndex(temperatures, startTemperature);
  let endIndex = xFindClosestIndex(temperatures, endTemperature);

  return (
    (temperatures[endIndex] - temperatures[startIndex]) /
    (times[endIndex] - times[startIndex])
  );
}

/**
 * Averages start and end mass over a window and returns the difference between the values
 *
 * @param {Array<Number>} masses
 * @param {Object} [options={}]
 * @param {Number} options.window average window (integer number of indices)
 * @returns {Number}
 */
function getTotalMassLoss(masses, options = {}) {
  let { window = 5 } = options;
  let startWeight = mean(masses.slice(0, window));
  let endWeight = mean(
    masses.slice(masses.length - 1 - window, masses.length - 1),
  );
  return startWeight - endWeight;
}

/**
 * see page 4 of 10.1002/fam.2849
 * The algorithm is initialized by saying the mass loss at step i is
 * the total mass loss divived by the total number of mass loss steps
 *
 * @param {Number} totalMassLoss starting mass - end mass
 * @param {Number} numberPeaks number of mass loss steps
 * @returns {Array<Number>}
 */
function getInitialMassLossGuess(totalMassLoss, numberPeaks) {
  let ratio = totalMassLoss / numberPeaks;
  let arr = new Array(numberPeaks).fill(ratio);
  return arr;
}

/**
 * ∆Ti = - ∆mi/em'i for all i (mass loss steps)
 * Note that in contrast to the peak width formula we use here ∆mi
 * and not m and divide by e
 *
 * @param {Array<Number>} initalMassLosses ∆mi
 * @param {Array<Number>} firstDerivatives m'i
 * @returns {Array<number>} initial estimates for the peak widths
 */
function getInitialWidthEstimates(initalMassLosses, firstDerivatives) {
  let initialWidths = [];

  for (let i = 0; i < initalMassLosses.length; i++) {
    initialWidths.push(-initalMassLosses[i] / (Math.E * firstDerivatives[i]));
  }

  return initialWidths;
}

/**
 * Eq. 21 in 10.1002/fam.2849
 *
 * @param {Number} massLoss ∆mi
 * @param {Number} peakWidth ∆Ti
 * @returns {Number}
 */
function firstDerivative(massLoss, peakWidth) {
  return -massLoss / (Math.E * peakWidth);
}

/**
 * Eq. 23 in 10.1002/fam.2849
 *
 * @param {Number} massLoss ∆mi
 * @param {Number} peakWidth ∆Ti
 * @returns {Number}
 */
function thirdDerivative(massLoss, peakWidth) {
  return massLoss / (Math.E * Math.pow(peakWidth, 3));
}
/**
 * Eq. 24 in 10.1002/fam.2849
 *
 * @param {Number} firstDerivative
 * @param {Number} thirdDerivative
 * @returns {Number}
 */
function getNewWidth(firstDerivative, thirdDerivative) {
  return Math.sqrt(-firstDerivative / thirdDerivative);
}

/**
 * Eq. 25 in 10.1002/fam.2849
 *
 * @param {Number} firstDerivative
 * @param {Number} peakWidth
 * @returns {Number}
 */
function getNewMassLoss(firstDerivative, peakWidth) {
  return -Math.E * firstDerivative * peakWidth;
}
/**
 * Eq. 32 in 10.1002/fam.2849
 *
 * @param {Array<Number>} peakWidths ∆Ti*
 * @param {Number} totalMassLoss
 * @param {Array<Number>} firstDerivatives
 * @param {Array<Object>} peaks
 */
function massConservingTemperatureWidths(
  peakWidths,
  totalMassLoss,
  firstDerivatives,
  peaks,
) {
  let a = [];

  for (let i = 0; i < peaks.length; i++) {
    a.push((-Math.E * firstDerivatives[i]) / peaks[i].x);
  }

  let denominator = xDotProduct(a, a);
  let numerator = xDotProduct(peakWidths, a) - totalMassLoss;
  let fraction = numerator / denominator;
  let rhs = xMultiply(a, fraction);
  let res = [];
  // ToDo: replace with xSubtract as soon as merged in spectra-processingƒ
  for (let i = 0; i < peakWidths.length; i++) {
    res[i] = peakWidths[i] - rhs[i];
  }
  return res;
}
/**
 * Apply Eq. 24 in 10.1002/fam.2849 for all peaks
 *
 * @param {Array<Number>} firstDerivatives
 * @param {Array<Number>} thirdDerivatives
 * @return {Array<Number>}
 */
function getNewWidths(firstDerivatives, thirdDerivatives) {
  let widths = [];
  for (let i = 0; i < firstDerivatives.length; i++) {
    widths.push(getNewWidth(firstDerivatives[i], thirdDerivatives[i]));
  }
  return widths;
}

/**
 * Apply Eq. 25 in 10.1002/fam.2849 for all peaks
 *
 * @param {Array<Number>} firstDerivatives
 * @param {Array<Number>} peakWidths
 * @return {Array<Number>}
 */
function getNewMassLosses(firstDerivatives, peakWidths) {
  let massLosses = [];
  for (let i = 0; i < firstDerivatives.length; i++) {
    massLosses.push(getNewMassLoss(firstDerivatives[i], peakWidths[i]));
  }
  return massLosses;
}

/**
 * Apply Eq. 21 in 10.1002/fam.2849 for all peaks
 *
 * @param {Array<Number>} massLosses
 * @param {Array<Number>} peakWidths
 * @returns {Array<Number>}
 */
function getFirstDerivatives(massLosses, peakWidths) {
  let firstDerivatives = [];
  for (let i = 0; i < massLosses.length; i++) {
    firstDerivatives.push(firstDerivative(massLosses[i], peakWidths[i]));
  }
  return firstDerivatives;
}

/**
 * Apply Eq. 23 in 10.1002/fam.2849 for all peaks
 *
 * @param {Array<Number>} massLosses
 * @param {Array<Number>} peakWidths
 * @returns {Array<Number>}
 */
function getThirdDerivatives(massLosses, peakWidths) {
  let thirdDerivatives = [];
  for (let i = 0; i < massLosses.length; i++) {
    thirdDerivatives.push(thirdDerivative(massLosses[i], peakWidths[i]));
  }
  return thirdDerivatives;
}

/**
 * Initialize the algorithm.
 * Calculate initial first and third derivatives
 *
 * @param {Array<object>} peaks
 * @param {Array<number>} masses
 * @returns {Object} contains properties firstDerivatives, thirdDerivatives, totalMassLoss, peaks, peakWidths
 */
function initialize(peaks, masses) {
  const totalMassLoss = getTotalMassLoss(masses);
  const derivatives = [];
  peaks.forEach((element) => {
    derivatives.push(element.y);
  });
  let massLosses = getInitialMassLossGuess(totalMassLoss, peaks.length);
  let peakWidths = getInitialWidthEstimates(massLosses, derivatives);

  let firstDerivatives = getFirstDerivatives(massLosses, peakWidths);
  let thirdDerivatives = getThirdDerivatives(massLosses, peakWidths);

  return {
    firstDerivatives: firstDerivatives,
    thirdDerivatives: thirdDerivatives,
    totalMassLoss: totalMassLoss,
    peakWidths: peakWidths,
    massLosses: massLosses,
    peaks: peaks,
  };
}

function selfConsistentLoop(
  firstDerivatives,
  thirdDerivatives,
  peakWidths,
  massLosses,
  totalMassLoss,
  peaks,
  options = {},
) {
  let {
    tolerance = 0.01,
    maxIterations = 1000,
    recordHistory = true,
  } = options;

  let widthError = Infinity;
  let massLossError = Infinity;
  let iteration = 0;

  let history = [];
  while (
    (widthError > tolerance) | (massLossError > tolerance) &&
    iteration < maxIterations
  ) {
    let newWidths = getNewWidths(firstDerivatives, thirdDerivatives);
    let newMassLosses = getNewMassLosses(firstDerivatives, newWidths);

    firstDerivatives = getFirstDerivatives(newMassLosses, newWidths);
    thirdDerivatives = getThirdDerivatives(newMassLosses, newWidths);

    newWidths = massConservingTemperatureWidths(
      newWidths,
      totalMassLoss,
      firstDerivatives,
      peaks,
    );
    widthError = xMeanAbsoluteError(newWidths, peakWidths);
    massLossError = xMeanAbsoluteError(newMassLosses, massLosses);

    massLosses = newMassLosses;
    peakWidths = newWidths;

    if (recordHistory) {
      history.push({
        firstDerivatives: firstDerivatives,
        thirdDerivatives: thirdDerivatives,
        massLosses: massLosses,
        peakWidths: peakWidths,
        iteration: iteration,
        widthError: widthError,
        massLossError: massLossError,
      });
    }
    iteration++;
  }

  let output = {
    firstDerivatives: firstDerivatives,
    thirdDerivatives: thirdDerivatives,
    massLosses: massLosses,
    peakWidths: peakWidths,
    iteration: iteration,
  };

  if (recordHistory) {
    output.history = history;
  }
  return output;
}
/**
 * Implements Eq. 6 in 10.1002/fam.2849
 *
 * @param {Number} peakTemperature Tp
 * @param {Number} peakWidth ∆Ti
 * @returns {Number} activation energy
 */
function getArrheniusEnergy(peakTemperature, peakWidth) {
  return (R * Math.pow(peakTemperature, 2)) / peakWidth;
}

/**
 * Implements Eq. 7 in 10.1002/fam.2849
 *
 * @param {Number} beta heating rate
 * @param {Number} peakTemperature
 * @param {Number} peakWidth ∆Tis
 * @returns {Number} pre-exponential factor
 */
function getArrheniusPreactivation(beta, peakTemperature, peakWidth) {
  return (beta / peakWidth) * Math.exp(peakTemperature / peakWidth);
}

/**
 * Sums up eq. 12 (10.1002/fam.2849) contributions to reconstruct the full TGA curve
 *
 * @param {Number} initialMass m0
 * @param {Array<Number>} peakTemperatures
 * @param {Array<Number>} peakWidths
 * @param {Array} temperatures
 * @returns {Object}
 */
function reconstructedDecomposition(
  initialMass,
  peakTemperatures,
  peakWidths,
  temperatures,
) {
  let massTraces = [];
  //Implementme: the initial mass of i is the final mass of i-1
  let m0 = initialMass;
  for (let i = 0; i < peakWidth.length; i++) {
    let res = m0 * peak(temperatures[i], peakTemperatures[i], peakWidths[i]);
    m0 = res[-1];
    massTraces.push(res);
  }

  let res = new Float64Array(massTraces.length);

  for (let i = 0; i < massTraces.length; i++) {
    res = xAdd(massTraces[i], res);
  }
  return { allTraces: massTraces, sum: res };
}

export function analyzeTGA(peaks, masses) {
  let initialization = initialize(peaks, masses);
  let res = selfConsistentLoop(
    initialization.firstDerivatives,
    initialization.thirdDerivatives,
    initialization.peakWidths,
    initialization.massLosses,
    initialization.totalMassLoss,
    peaks,
  );
  // ToDo: get the Arrhenius parameters and reconstructed curve
  return res;
}

export const testables = {
  initialize: initialize,
  getTotalMassLoss: getTotalMassLoss,
  getInitialMassLossGuess: getInitialMassLossGuess,
  peakWidth: peakWidth,
  getInitialWidthEstimates: getInitialWidthEstimates,
  massConservingTemperatureWidths: massConservingTemperatureWidths,
  selfConsistentLoop: selfConsistentLoop,
};
