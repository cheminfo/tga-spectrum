import { Analysis } from '..';

import { parsePerkinElmer } from './parsePerkinElmer';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} text - String containing the JCAMP data
 * @return {Analysis} - New class element with the given data
 */
export function fromPerkinElmer(text) {
  let analysis = new Analysis();
  let spectrum = parsePerkinElmer(text);
  analysis.pushSpectrum(
    { x: spectrum.data.temperature, y: spectrum.data.weight },
    {
      xLabel: 'Temperature [°C]',
      yLabel: 'Weight [mg]',
      dataType: 'TGA',
      title: spectrum.meta['Sample ID'],
      meta: spectrum.meta,
    },
  );
  analysis.pushSpectrum(
    { x: spectrum.data.time, y: spectrum.data.weight },
    {
      xLabel: 'Time [s]',
      yLabel: 'Weight [mg]',
      dataType: 'TGA',
      title: spectrum.meta['Sample ID'],
      meta: spectrum.meta,
      flavor: 'weightVersusTime',
    },
  );
  return analysis;
}
