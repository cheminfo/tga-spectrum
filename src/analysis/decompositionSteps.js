/*Implements automatic TGA analysis following 10.1002/fam.2849*/
import mean from 'ml-array-mean';
import savitzkyGolay from 'ml-savitzky-golay';

import xFindClosestIndex from 'ml-spectra-processing';
const R = 8.313;
function findPeaks(temperatures, masses, options = {}) {
  // find the points where second derivative m''=0 and third derivative m'''>0
  // return a list of the indices
  // threshold on the peak height rel. to max peak height
  let { _ = 1, polynomial = 2, windowSize = 5, tolerance = 0.01 } = options;
  let firstDerivative = savitzkyGolay(masses, 1, {
    derivative: 1,
    polynomial: polynomial,
    windowSize: windowSize,
  });

  let thirdDerivative = savitzkyGolay(masses, 1, {
    derivative: 3,
    polynomial: polynomial,
    windowSize: windowSize,
  });

  let peaks = [];
  for (let i = 0; i < masses.length; i++) {
    if (
      (Math.abs(firstDerivative[i]) < tolerance) &
      (thirdDerivative[i] > -tolerance)
    ) {
      peaks.push({ temperature: temperatures[i], index: i });
    }
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

  let massLosses = getInitialMassLossGuess(masses, peaks.length);
  let peakWidths = getInitialWidthEstimates(
    massLosses,
    peaks.map((a) => a.temperature),
  );

  let firstDerivatives = getFirstDerivatives(massLosses, peakWidths);
  let thirdDerivatives = getThirdDerivatives(massLosses, peakWidths);
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

export function analyzeTGA(options = {}) {}
