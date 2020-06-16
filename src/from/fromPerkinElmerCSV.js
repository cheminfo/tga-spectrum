import Papa from 'papaparse';

import { Analysis } from '..';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} text - String containing the JCAMP data
 * @return {Analysis} - New class element with the given data
 */
export function fromPerkinElmerCSV(text) {
  let parsed = Papa.parse(text, {
    skipEmptyLines: true,
    header: true,
    dynamicTyping: true,
  }).data;
  let analysis = new Analysis();
  analysis.pushSpectrum(
    {
      x: parsed.map((d) => d['Sample Temperature']),
      y: parsed.map((d) => d['Unsubtracted Weight']),
    },
    {
      xLabel: 'Temperature [°C]',
      yLabel: 'Weight [mg]',
    },
  );
  analysis.pushSpectrum(
    {
      x: parsed.map((d) => d.Time),
      y: parsed.map((d) => d['Unsubtracted Weight']),
    },
    {
      xLabel: 'Time [s]',
      yLabel: 'Weight [mg]',
    },
  );
  return analysis;
}
