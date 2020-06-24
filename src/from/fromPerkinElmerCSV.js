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
      x: {
        data: parsed.map((d) => d['Program Temperature']),
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.map((d) => d['Unsubtracted Weight']),
        label: 'Weight [mg]',
      },
      t: {
        data: parsed.map((d) => d['Sample Temperature']),
        label: 'Sample temperature [°C]',
      },
    },
    { dataType: 'TGA' },
  );

  analysis.pushSpectrum(
    {
      x: { data: parsed.map((d) => d.Time), label: 'Time [s]' },
      y: {
        data: parsed.map((d) => d['Unsubtracted Weight']),
        label: 'Weight [mg]',
      },
    },
    { dataType: 'TGA' },
  );
  return analysis;
}
