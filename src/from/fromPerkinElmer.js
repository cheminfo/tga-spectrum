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
    {
      x: {
        data: spectrum.data.temperature,
        label: 'Temperature [°C]',
      },
      y: {
        data: spectrum.data.weight,
        label: 'Weight [mg]',
      },
    },
    {
      dataType: 'TGA',
      title: spectrum.meta['Sample ID'],
      meta: spectrum.meta,
    },
  );
  analysis.pushSpectrum(
    {
      x: {
        data: spectrum.data.time,
        label: 'Time [min]',
      },
      y: {
        data: spectrum.data.weight,
        label: 'Weight [mg]',
      },
    },
    {
      dataType: 'TGA',
      title: spectrum.meta['Sample ID'],
      meta: spectrum.meta,
    },
  );
  return analysis;
}
