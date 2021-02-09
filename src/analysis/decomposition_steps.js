function findPeaks(spectrum) {
  // find the points where second derivative m''=0 and third derivative m'''>0
  // return a list of the indices
  // threshold on the peak height rel. to max peak height
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