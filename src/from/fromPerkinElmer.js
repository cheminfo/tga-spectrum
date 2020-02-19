import { Spectrum } from '../Spectrum';

import parsePerkinElmer from './parsePerkinElmer';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} text - String containing the JCAMP data
 * @return {Spectrum} - New class element with the given data
 */
export function fromPerkinElmer(text) {
  let spectrum = new Spectrum();
  let result = parsePerkinElmer(text);

  spectrum.add(
    result.data.temperature,
    result.data.weight,
    'weightVersusTemperature',
    {
      xLabel: 'Temperature [°C]',
      yLabel: 'Weight [mg]',
      title: result.meta['Sample ID'],
      meta: result.meta,
    },
  );
  spectrum.add(result.data.time, result.data.weight, 'weightVersusTime', {
    xLabel: 'Time [s]',
    yLabel: 'Weight [mg]',
    title: result.meta['Sample ID'],
    meta: result.meta,
  });
  return spectrum;
}
