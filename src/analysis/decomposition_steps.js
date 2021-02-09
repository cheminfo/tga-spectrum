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


function totalMassLoss(){}

function initialMassLossGuess(){}

function initialWidthEstimates(){}