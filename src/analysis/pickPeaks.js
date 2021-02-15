/* Implements automatic peak picking (in the derivatives), optimization and joining of the peaks */
import { rollingBallBaseline } from 'baselines';
import { gsd, joinBroadPeaks, optimizePeaks } from 'ml-gsd';
import savitzkyGolay from 'ml-savitzky-golay';
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

function negativeFilter(peaks) {
  let filteredPeaks = [];
  peaks.forEach((elm) => {
    if (elm.y < 0) {
      filteredPeaks.push(elm);
    }
  });
  return filteredPeaks;
}

function thirdDerivativeFilter(
  firstDerivative,
  joinedPeaks,
  tolerance,
  polynomial,
  windowSize,
) {
  let peaks = [];

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

  return peaks;
}

export function findPeaks(temperatures, masses, options = {}) {
  // find the points where second derivative m''=0 and third derivative m'''>0
  // return a list of the indices
  // threshold on the peak height rel. to max peak height
  let {
    polynomial = 2,
    windowSize = 5,
    tolerance = 0.0001,
    width = 20,
    minMaxRatio = 0.05,
    minWidth = 1,
    broadRatio = 0.05,
    thirdDerivFilter = true,
    baselineCorrection = {
      apply: true,
      windowS: 0.04,
      windowM: 0.02,
    },
  } = options;

  let firstDerivative = savitzkyGolay(masses, 1, {
    derivative: 1,
    polynomial: polynomial,
    windowSize: windowSize,
    pad: 'post',
    padValue: 'replicate',
  });

  let s;
  if (baselineCorrection.apply) {
    let baselineCorrected = rollingBallBaseline(firstDerivative, {
      windowM: Math.round(firstDerivative.length * baselineCorrection.windowM),
      windowS: Math.round(firstDerivative.length * baselineCorrection.windowS),
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
      broadRatio: broadRatio,
      sgOptions: {
        windowSize: windowSize,
        polynomial: polynomial,
      },
    },
  );

  let optimizedPeaks = optimizePeaks({ x: temperatures, y: s }, pp);
  let joinedPeaks = joinBroadPeaks(optimizedPeaks, { width: width });
  joinedPeaks = joinedPeaks.filter((elem) => {
    return elem.width > minWidth;
  });
  joinedPeaks = negativeFilter(joinedPeaks);
  let peaks;

  if (thirdDerivFilter) {
    // ToDo: implement directly third derivative, the SG code does not work for this case
    peaks = thirdDerivativeFilter(
      firstDerivative,
      joinedPeaks,
      tolerance,
      polynomial,
      windowSize,
    );
  } else {
    peaks = joinedPeaks;
  }

  return peaks;
}
