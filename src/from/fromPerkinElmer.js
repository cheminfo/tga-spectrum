import { Analysis } from '..';

import { parsePerkinElmer } from './parsePerkinElmer';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} text - String containing the JCAMP data
 * @return {Analysis} - New class element with the given data
 */
export function fromPerkinElmer(text) {
  let analysis = new Analysis();
  let result = parsePerkinElmer(text);
  analysis.set(
    { x: result.data.temperature, y: result.data.weight },
    {
      xLabel: 'Temperature [°C]',
      yLabel: 'Weight [mg]',
      title: result.meta['Sample ID'],
      meta: result.meta,
      flavor: 'weightVersusTemperature',
    },
  );
  analysis.set(
    { x: result.data.time, y: result.data.weight },
    {
      xLabel: 'Time [s]',
      yLabel: 'Weight [mg]',
      title: result.meta['Sample ID'],
      meta: result.meta,
      flavor: 'weightVersusTime',
    },
  );
  return analysis;
}
