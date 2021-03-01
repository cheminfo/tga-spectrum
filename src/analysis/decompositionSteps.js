/*Implements automatic TGA analysis following 10.1002/fam.2849
In contrast to the algorithm described in this paper we use initial peaks widths
from global spectra deconvolution. We also use those to calculate the initial weight losses
*/
import mean from 'ml-array-mean';
import {
  xFindClosestIndex,
  xMeanAbsoluteError,
  xDotProduct,
  xMultiply,
  xAdd,
  xRollingAverage,
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
/**
 * Get the heating rate (beta in 10.1002/fam.2849)
 *
 * @param {Array<number>} times time axis
 * @param {Array<number>} temperatures temperature axis
 * @param {Number} startTemperature
 * @param {Number} endTemperature
 * @returns {Number}
 */
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
    a.push(-Math.E * firstDerivatives[i]);
  }

  let normalization = xDotProduct(a, a);
  let numerator = xDotProduct(peakWidths, a) - totalMassLoss;
  let fraction = numerator / normalization;
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

function peakMassLoss(peak, temperatures, masses) {
  let tStart = peak.x - peak.width;
  let tEnd = peak.x + peak.width;

  let startMass = masses[xFindClosestIndex(temperatures, tStart)];
  let endMass = masses[xFindClosestIndex(temperatures, tEnd)];
  return startMass - endMass;
}

/**
 * Initialize the algorithm.
 * Calculate initial first and third derivatives
 *
 * @param {Array<object>} peaks
 * @param {Array<number>} masses
 * @param {Array<number>} temperatures
 * @returns {Object} contains properties firstDerivatives, thirdDerivatives, totalMassLoss, peaks, peakWidths
 */
function initialize(peaks, masses, temperatures) {
  const totalMassLoss = getTotalMassLoss(masses);
  const derivatives = [];
  let peakWidths = [];
  let massLosses = [];
  // using the width from the fit seems to be more stable than using  getInitialWidthEstimates(massLosses, derivatives);
  peaks.forEach((element) => {
    derivatives.push(element.y);
    peakWidths.push(element.width);
  });

  peaks.forEach((peak) => {
    massLosses.push(peakMassLoss(peak, temperatures, masses));
  });

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

/**
 * Runs the self-consistent loop
 *
 * @param {Array<number>} firstDerivatives initial values for the first derivatives
 * @param {Array<number>} thirdDerivatives initial values for the third derivatives
 * @param {Array<number>} peakWidths initial values for the peaks widths
 * @param {Array<number>} massLosses initial values for the mass losses
 * @param {Array<number>} totalMassLoss total mass loss, that is the sum(massLosses)
 * @param {Array<object>} peaks must contain x property (temperature)
 * @param {Array<number>} betas heating rates, used for the calculation of the preactivations
 * @param {Object} [options={}]
 * @returns {Object}
 */
function selfConsistentLoop(
  firstDerivatives,
  thirdDerivatives,
  peakWidths,
  massLosses,
  totalMassLoss,
  peaks,
  betas,
  options = {},
) {
  let {
    massTolerance = 0.001,
    widthTolerance = 0.001,
    maxIterations = 1000,
    recordHistory = true,
  } = options;

  let widthError = Infinity;
  let massLossError = Infinity;
  let iteration = 0;

  let history = [];
  let highError =
    (widthError > widthTolerance) | (massLossError > massTolerance);

  history.push({
    firstDerivatives: firstDerivatives,
    thirdDerivatives: thirdDerivatives,
    massLosses: massLosses,
    peakWidths: peakWidths,
    iteration: iteration,
    widthError: widthError,
    massLossError: massLossError,
  });
  while (highError && iteration < maxIterations) {
    let lastStep = history[history.length - 1];
    let starWidths = getNewWidths(
      lastStep.firstDerivatives,
      lastStep.thirdDerivatives,
    );

    firstDerivatives = getFirstDerivatives(
      lastStep.massLosses,
      lastStep.peakWidths,
    );
    thirdDerivatives = getThirdDerivatives(
      lastStep.massLosses,
      lastStep.peakWidths,
    );

    let newWidths = massConservingTemperatureWidths(
      starWidths,
      totalMassLoss,
      firstDerivatives,
      peaks,
    );

    let newMassLosses = getNewMassLosses(firstDerivatives, newWidths);
    widthError = xMeanAbsoluteError(newWidths, lastStep.peakWidths);
    massLossError = xMeanAbsoluteError(newMassLosses, lastStep.massLosses);
    history.push({
      firstDerivatives: firstDerivatives,
      thirdDerivatives: thirdDerivatives,
      massLosses: newMassLosses,
      peakWidths: newWidths,
      iteration: iteration,
      widthError: widthError,
      massLossError: massLossError,
    });

    iteration++;
    highError = widthError > widthTolerance || massLossError > massTolerance;
  }

  let output = {};
  output.steps = [];
  let lastStep = history[history.length - 1];
  for (let i = 0; i < lastStep.firstDerivatives.length; i++) {
    output.steps.push({
      step: i,
      firstDerivative: lastStep.firstDerivatives[i],
      thirdDerivative: lastStep.thirdDerivatives[i],
      massLoss: lastStep.massLosses[i],
      temperature: peaks[i].x,
      peakWidth: lastStep.peakWidths[i],
      activationEnergy: getArrheniusEnergy(peaks[i].x, lastStep.peakWidths[i]),
      preactivationFactor: getArrheniusPreactivation(
        betas[i],
        peaks[i].x,
        lastStep.peakWidths[i],
      ),
    });
  }

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

function filledSlice(values, lowerLimit, upperLimit) {
  let array = new Array(values.length);
  array = array.fill(0);
  for (let i = lowerLimit; i < upperLimit; i++) {
    array[i] = values[i];
  }
  return array;
}

/**
 * Sums up eq. 12 (10.1002/fam.2849) contributions to reconstruct the full TGA curve
 *
 * @export
 * @param {Number} initialMass m0
 * @param {Array<Number>} massLosses
 * @param {Array<Number>} peakTemperatures - should be in Kelvin
 * @param {Array<Number>} peakWidths
 * @param {Array} temperatures - should be in Kelvin
 * @returns {Object}
 */
export function reconstructedDecomposition(
  initialMass,
  massLosses,
  peakTemperatures,
  peakWidths,
  temperatures,
) {
  let massTraces = [];
  //Implementme: the initial mass of i is the final mass of i-1
  let m0 = initialMass;
  for (let i = 0; i < peakWidths.length; i++) {
    let massTrace = [];
    for (let j = 0; j < temperatures.length; j++) {
      massTrace.push(
        massLosses[i] *
          peak(temperatures[j], peakTemperatures[i], peakWidths[i]) +
          m0 -
          massLosses[i],
      );
    }
    m0 -= massLosses[i];
    massTraces.push(massTrace);
  }

  //ToDo: replace with FloaArray as soon as merged
  let res = new Array(temperatures.length);
  res = res.fill(0);
  let upperLimits = [0];
  if (peakTemperatures.length > 1) {
    for (let i = 0; i < peakTemperatures.length - 1; i++) {
      upperLimits.push(
        xFindClosestIndex(
          temperatures,
          (peakTemperatures[i] + peakTemperatures[i + 1]) / 2,
        ),
      );
    }
  }

  upperLimits.push(temperatures.length);
  for (let i = 0; i < massTraces.length; i++) {
    res = xAdd(
      filledSlice(massTraces[i], upperLimits[i], upperLimits[i + 1]),
      res,
    );
  }
  res = xRollingAverage(res, { padding: { algorithm: 'duplicate', size: 2 } });
  return { allTraces: massTraces, sum: res };
}

/**
 * Calculates the local heating rates
 *
 * @param {Array<Number>} times
 * @param {Array<Number>} temperatures
 * @param {Array<Number>} peaks
 * @returns {Array<Number>}
 */
function findBetas(times, temperatures, peaks) {
  let betas = [];
  for (let i = 0; i < peaks.length; i++) {
    let startTemp = peaks[i].x - peaks[i].width;
    let endTemp = peaks[i].x + peaks[i].width;
    betas.push(getBeta(times, temperatures, startTemp, endTemp));
  }
  return betas;
}

/**
 *
 * @export
 * @param {Array<Object>} peaks
 * @param {Array<Number>} masses
 * @param {Array<Number>} temperatures - for the Arrhenius parameters this should be in Kelvin
 * @param {Array<Number>} times - for the calculation of the preactivation factor. The preactivation factor will have the 1/unit of this unit. Usually this is in seconds.
 * @returns {Object}
 */
export function analyzeTGA(peaks, masses, temperatures, times) {
  let initialization = initialize(peaks, masses, temperatures);
  let betas = findBetas(times, temperatures, peaks);
  let res = selfConsistentLoop(
    initialization.firstDerivatives,
    initialization.thirdDerivatives,
    initialization.peakWidths,
    initialization.massLosses,
    initialization.totalMassLoss,
    peaks,
    betas,
  );
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
  getBeta: getBeta,
  findBetas: findBetas,
};
