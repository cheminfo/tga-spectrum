import Spectrum from '../Spectrum';

import parsePerkinElmer from './parsePerkinElmer';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} text - String containing the JCAMP data
 * @return {Spectrum} - New class element with the given data
 */
export default function fromPerkinElmer(text) {
  let spectrum = new Spectrum();
  let result = parsePerkinElmer(text);
  spectrum.set(
    { x: result.data.temperature, y: result.data.weight },
    {
      xLabel: 'Temperature [°C]',
      yLabel: 'Weight [mg]',
      title: result.meta['Sample ID'],
      meta: result.meta,
      flavor: 'weightVersusTemperature',
    },
  );
  spectrum.set(
    { x: result.data.time, y: result.data.weight },
    {
      xLabel: 'Time [s]',
      yLabel: 'Weight [mg]',
      title: result.meta['Sample ID'],
      meta: result.meta,
      flavor: 'weightVersusTime',
    },
  );
  return spectrum;
}
