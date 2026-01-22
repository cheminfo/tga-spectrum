import { ensureString } from 'ensure-string';

import { Analysis } from '../index.js';

import { parsePerkinElmer } from './parsePerkinElmer.js';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param text - String containing the JCAMP data
 * @param arrayBuffer
 * @returns - New class element with the given data
 */
export function fromPerkinElmer(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  const text = ensureString(arrayBuffer);
  const analysis = new Analysis();
  const spectrum = parsePerkinElmer(text);

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
