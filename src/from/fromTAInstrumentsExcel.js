import { Analysis } from '..';

import { parseTAInstrumentsExcel } from './parseTAInstrumentsExcel';

export function fromTAInstrumentsExcel(arrayBuffer) {
  let analysis = new Analysis();
  let parsed = parseTAInstrumentsExcel(arrayBuffer);

  analysis.pushSpectrum(
    {
      x: {
        data: parsed.temperature,
        type: 'dependent',
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.weight,
        type: 'dependent',
        label: 'Weight [mg]',
      },
      z: {
        data: parsed.weightPercent,
        type: 'dependent',
        label: 'Weight [%]',
      },
      t: {
        data: parsed.time,
        type: 'independent',
        label: 'Time [s]',
      },
    },
    { dataType: 'TGA', title: parsed.meta.sampleName, meta: parsed.meta },
  );

  return analysis;
}
