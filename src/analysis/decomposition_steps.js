import savitzkyGolay from 'ml-savitzky-golay';

function findPeaks(mass, options={}) {
  // find the points where second derivative m''=0 and third derivative m'''>0
  // return a list of the indices
  // threshold on the peak height rel. to max peak height
  let {_=1, polynomial=2, windowSize=5, tolerance=0.01} = options
  let firstDerivative = savitzkyGolay(mass, 1, {
    derivative: 1,
    polynomial: polynomial,
    windowSize: windowSize,
  });

  let thirdDerivative = savitzkyGolay(mass, 1, {
    derivative: 3,
    polynomial: polynomial,
    windowSize: windowSize,
  });

  let peakIndices = []
  for (let i=0; i<mass.length; i++) {
    if ((Math.abs(firstDerivative[i])<tolerance) & (thirdDerivative[i] > -tolerance)) {peakIndices.push(i);}
  }
}

function peakWidth(massPeak, derivativePeak) {
  return -massPeak / derivativePeak;
}

function peak(temp, tempPeak, massPeak, derivativePeak) {
  let peakW = peakWidth(massPeak, derivativePeak);
  return -Math.exp((temp - tempPeak) / peakW);
}

function getBeta(){//in first approximation we can take it constant, but we can also make a linearity approx within a range}

function totalMassLoss(){//mi = total mass loss / number peaks}

function initialMassLossGuess(){}

function initialWidthEstimates(){}

function firstDerivative(massLoss, peakWidth) {
    return - massLoss / (Math.E * peakWidth);
}

function thirdDerivative(massLoss, peakWidth) {
    return  massLoss / (Math.E * peakWidth**3);
}

function getNewWidth(firstDerivative, thirdDerivative) {
    return Math.sqrt(-firstDerivative/thirdDerivative);
}

function getNewMassLoss(firstDerivative, peakWidth) {
    return - Math.E * firstDerivative * peakWidth;
}