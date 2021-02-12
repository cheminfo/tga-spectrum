/*Implements automatic TGA analysis following 10.1002/fam.2849*/
import mean from 'ml-array-mean';
import savitzkyGolay from 'ml-savitzky-golay';
import { xFindClosestIndex, xMeanAbsoluteError } from 'ml-spectra-processing';
import { gsd, joinBroadPeaks } from 'ml-gsd';
import { iterativePolynomialBaseline, rollingBallBaseline } from 'baselines';

const R = 8.313;

/**
 * Calls global spectrum deconvolution to pick peaks
 * @param {object} [data] Object {x:[], y:[]}
 * @param {object} [options={}]
 * @param {object} [options.shape={}] - Object that specified the kind of shape to calculate the FWHM instead of width between inflection points. see https://mljs.github.io/peak-shape-generator/#inflectionpointswidthtofwhm
 * @param {object} [options.shape.kind='gaussian']
 * @param {object} [options.shape.options={}]
 * @param {object} [options.sgOptions] - Options object for Savitzky-Golay filter. See https://github.com/mljs/savitzky-golay-generalized#options
 * @param {number} [options.sgOptions.windowSize = 9] - points to use in the approximations
 * @param {number} [options.sgOptions.polynomial = 3] - degree of the polynomial to use in the approximations
 * @param {number} [options.minMaxRatio = 0.00025] - Threshold to determine if a given peak should be considered as a noise
 * @param {number} [options.broadRatio = 0.00] - If `broadRatio` is higher than 0, then all the peaks which second derivative
 * smaller than `broadRatio * maxAbsSecondDerivative` will be marked with the soft mask equal to true.
 * @param {number} [options.noiseLevel = 0] - Noise threshold in spectrum units
 * @param {boolean} [options.maxCriteria = true] - Peaks are local maximum(true) or minimum(false)
 * @param {boolean} [options.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables
 * @param {boolean} [options.realTopDetection = false] - Use a quadratic optimizations with the peak and its 3 closest neighbors
 * to determine the true x,y values of the peak?
 * @param {number} [options.heightFactor = 0] - Factor to multiply the calculated height (usually 2)
 * @param {number} [options.derivativeThreshold = -1] - Filters based on the amplitude of the first derivative
 * @returns {Array<object>}
 */

function peakPicking(data, options = {}) {
  let peaks = gsd(data, options);
  return peaks;
}

function findPeaks(temperatures, masses, options = {}) {
  // find the points where second derivative m''=0 and third derivative m'''>0
  // return a list of the indices
  // threshold on the peak height rel. to max peak height
  let {
    _ = 1,
    polynomial = 2,
    windowSize = 9,
    tolerance = 0.0001,
    width = 15,
    minMaxRatio = 0.05,
    minWidth = 1,
    thirdDerivFilter = false,
    baselineCorrection = true,
  } = options;

  let firstDerivative = savitzkyGolay(masses, 1, {
    derivative: 1,
    polynomial: polynomial,
    windowSize: windowSize,
    pad: 'post',
    padValue: 'replicate',
  });

  let s;
  if (baselineCorrection) {
    let baselineCorrected = rollingBallBaseline(firstDerivative, {
      windowM: Math.round(masses.length * 0.04),
      windowS: Math.round(masses.length * 0.08),
    });
    s = baselineCorrected.correctedSpectrum;
  } else {
    s = firstDerivative;
  }

  // it seems more robust to just look at the second derivative
  let pp = peakPicking(
    { x: temperatures, y: s },
    {
      minMaxRatio: minMaxRatio,
      maxCriteria: false,
      sgOptions: {
        windowSize: windowSize,
        polynomial: polynomial,
        smoothY: false,
      },
    },
  );

  let joinedPeaks = joinBroadPeaks(pp, { width: width });
  joinedPeaks = joinedPeaks.filter((elem) => {
    return elem.width > minWidth;
  });
  let peaks = [];

  if (thirdDerivFilter) {
    // ToDo: implement directly third derivative
    let thirdDerivative = savitzkyGolay(firstDerivative, 1, {
      derivative: 2,
      polynomial: polynomial,
      windowSize: windowSize,
      pad: 'post',
      padValue: 'replicate',
    });

    joinedPeaks.forEach((elm) => {
      if (thirdDerivative[elm.index] > -tolerance) {
        peaks.push(elm);
      }
    });
  } else {
    peaks = joinedPeaks;
  }

  return peaks;
}

function peakWidth(massPeak, derivativePeak) {
  return -massPeak / derivativePeak;
}

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

function getTotalMassLoss(masses, options = {}) {
  let { window = 5 } = options;
  let startWeight = mean(masses.slice(0, window));
  let endWeight = mean(
    masses.slict(masses.length - 1, masses.length - 1 - window),
  );
  return startWeight - endWeight;
}

function getInitialMassLossGuess(totalMassLoss, numberPeaks) {
  let ratio = totalMassLoss / numberPeaks;
  let arr = new Array(numberPeaks).fill(ratio);
  return arr;
}

function getInitialWidthEstimates(initalMassLosses, peakTemperatures) {
  let initialWidths = [];

  for (let i = 0; i < initalMassLosses.length; i++) {
    initialWidths.push(-initalMassLosses[i] / (Math.E * peakTemperatures[i]));
  }

  return initialWidths;
}

function firstDerivative(massLoss, peakWidth) {
  return -massLoss / (Math.E * peakWidth);
}

function thirdDerivative(massLoss, peakWidth) {
  return massLoss / (Math.E * peakWidth ** 3);
}

function getNewWidth(firstDerivative, thirdDerivative) {
  return Math.sqrt(-firstDerivative / thirdDerivative);
}

function getNewMassLoss(firstDerivative, peakWidth) {
  return -Math.E * firstDerivative * peakWidth;
}

function getNewWidths(firstDerivatives, thirdDerivatives) {
  let widths = [];
  for (let i = 0; i < firstDerivatives.length; i++) {
    widths.push(getNewWidth(firstDerivatives[i], thirdDerivatives[iƒ]));
  }
}

function getNewMassLosses(firstDerivatives, peakWidths) {
  let massLosses = [];
  for (let i = 0; i < firstDerivatives.length; i++) {
    massLosses.push(getNewWidth(firstDerivatives[i], peakWidths[iƒ]));
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

function initialize(temperatures, masses) {
  const totalMassLoss = getTotalMassLoss(masses);
  const peaks = findPeaks(temperatures);

  let massLosses = getInitialMassLossGuess(totalMassLoss, peaks.length);
  let peakWidths = getInitialWidthEstimates(
    massLosses,
    peaks.map((a) => a.temperature),
  );

  let firstDerivatives = getFirstDerivatives(massLosses, peakWidths);
  let thirdDerivatives = getThirdDerivatives(massLosses, peakWidths);

  return { firstDerivatives, thirdDerivatives };
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
  findPeaks: findPeaks,
};
