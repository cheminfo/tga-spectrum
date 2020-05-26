import Spectrum from '../Spectrum';

import Papa from 'papaparse';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} text - String containing the JCAMP data
 * @return {Spectrum} - New class element with the given data
 */
export default function fromPerkinElmerCSV(text) {
  let parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data;

  let spectrum = new Spectrum();
  spectrum.set(
    {
      x: parsed.map((d) => d['Sample Temperature']),
      y: parsed.map((d) => d['Unsubtracted Weight']),
    },
    {
      xLabel: 'Temperature [°C]',
      yLabel: 'Weight [mg]',
      flavor: 'weightVersusTemperature',
    },
  );
  spectrum.set(
    {
      x: parsed.map((d) => d.Time),
      y: parsed.map((d) => d['Unsubtracted Weight']),
    },
    {
      xLabel: 'Time [s]',
      yLabel: 'Weight [mg]',
      flavor: 'weightVersusTime',
    },
  );
  return spectrum;
}
