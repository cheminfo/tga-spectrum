import { ensureString } from 'ensure-string';

import { Analysis } from '..';

import { parseTAInstruments } from './parseTAInstruments';

export function fromTAInstruments(blob) {
  const text = ensureString(blob);
  let analysis = new Analysis();
  let parsed = parseTAInstruments(text);

  analysis.pushSpectrum(
    {
      x: {
        data: parsed.data.temperature,
        type: 'dependent',
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.data.weight,
        type: 'dependent',
        label: 'Weight [mg]',
      },
      t: {
        data: parsed.data.time,
        type: 'independent',
        label: 'Time [min]',
      },
    },
    { dataType: 'TGA', title: parsed.meta.sampleName, meta: parsed.meta },
  );

  return analysis;
}
