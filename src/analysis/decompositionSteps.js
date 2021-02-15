/*Implements automatic TGA analysis following 10.1002/fam.2849*/
import mean from 'ml-array-mean';
import {
  xFindClosestIndex,
  xMeanAbsoluteError,
  xDotProduct,
  xSubtract,
  xDivide,
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
  console.log('a', a);
  let denominator = xDotProduct(a, a);
  console.log('denominator', denominator);
  let numerator = xSubtract(xDotProduct(peakWidths, a), totalMassLoss);
  console.log('numerator', numerator);
  let fraction = xDivide(numerator, denominator);
  console.log('fraction', fraction);
  let leftHandSide = xDotProduct(fraction, a);
  console.log('leftHandSide', leftHandSide);
  return xSubtract(peakWidths, leftHandSide);
}

function getNewWidths(firstDerivatives, thirdDerivatives) {
  let widths = [];
  for (let i = 0; i < firstDerivatives.length; i++) {
    widths.push(getNewWidth(firstDerivatives[i], thirdDerivatives[i]));
  }
}

function getNewMassLosses(firstDerivatives, peakWidths) {
  let massLosses = [];
  for (let i = 0; i < firstDerivatives.length; i++) {
    massLosses.push(getNewMassLoss(firstDerivatives[i], peakWidths[i]));
  }
}

function getFirstDerivatives(massLosses, peakWidths) {
  let firstDerivatives = [];
  for (let i = 0; i < massLosses.length; i++) {
    firstDerivatives.push(firstDerivative(massLosses[i], peakWidths[i]));
  }
  return firstDerivatives;
}

function getThirdDerivatives(massLosses, peakWidths) {
  let thirdDerivatives = [];
  for (let i = 0; i < massLosses.length; i++) {
    thirdDerivatives.push(thirdDerivative(massLosses[i], peakWidths[i]));
  }
  return thirdDerivatives;
}

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
  };
}

function selfConsistentLoop(
  firstDerivatives,
  thirdDerivatives,
  peakWidths,
  massLosses,
  options = {},
) {
  let {
    tolerance = 0.1,
    maxIterations = 1000,
    recordHistory = false,
  } = options;

  let widthError = Math.infinite;
  let massLossError = Math.infinite;
  let iteration = 0;

  let history = [];
  while (
    (widthError > tolerance) | (massLossError > tolerance) &&
    iteration < maxIterations
  ) {
    let newWidths = getNewWidths(firstDerivatives, thirdDerivatives);
    let newMassLosses = getNewMassLosses(firstDerivatives, newWidths);

    widthError = xMeanAbsoluteError(newWidths, peakWidths);
    massLossError = xMeanAbsoluteError(newMassLosses, massLosses);

    firstDerivatives = getFirstDerivatives(newMassLosses, newWidths);
    thirdDerivatives = getThirdDerivatives(newMassLosses, newWidths);

    massLosses = newMassLosses;
    peakWidths = newWidths;
    iteration++;

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

function getArrheniusEnergy(peakTemperature, peakWidth) {
  return (R * peakTemperature ** 2) / peakWidth;
}

function getArrheniusPreactivation(beta, peakTemperature, peakWidth) {
  return (beta / peakWidth) * Math.exp(peakTemperature / peakWidth);
}

function reconstructedDecomposition(
  initialMass,
  peakTemperature,
  peakWidth,
  temperatures,
) {
  let massTrace = [];
  temperatures.forEach((temp) => {
    massTrace.push(initialMass * peak(temp, peakTemperature, peakWidth));
  });
}

export function analyzeTGA() {}

export const testables = {
  initialize: initialize,
  getTotalMassLoss: getTotalMassLoss,
  getInitialMassLossGuess: getInitialMassLossGuess,
  peakWidth: peakWidth,
  getInitialWidthEstimates: getInitialWidthEstimates,
  massConservingTemperatureWidths: massConservingTemperatureWidths,
};
