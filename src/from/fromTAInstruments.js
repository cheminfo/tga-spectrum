import { Analysis } from '..';

import { parseTAInstruments } from './parseTAInstruments';

export function fromTAInstruments(text) {
  let analysis = new Analysis();
  let parsed = parseTAInstruments(text);

  analysis.pushSpectrum(
    {
      x: {
        data: parsed.data.temperature,
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.data.weight,
        label: 'Weight [mg]',
      },
    },
    { dataType: 'TGA', title: parsed.meta.sampleName, meta: parsed.meta },
  );

  analysis.pushSpectrum(
    {
      x: {
        data: parsed.data.time,
        label: 'Time [s]',
      },
      y: {
        data: parsed.data.weight,
        label: 'Weight [mg]',
      },
    },
    {
      dataType: 'TGA',
      title: parsed.meta.sampleName,
      meta: parsed.meta,
    },
  );

  return analysis;
}
