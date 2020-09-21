import { Analysis } from '..';

import { parseTAInstrumentsExcel } from './parseTAInstrumentsExcel';

export function fromTAInstruments(text) {
  let analysis = new Analysis();
  let parsed = parseTAInstrumentsExcel(text);

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
        label: 'Time [s]',
      },
    },
    { dataType: 'TGA', title: parsed.meta.sampleName, meta: parsed.meta },
  );

  return analysis;
}
