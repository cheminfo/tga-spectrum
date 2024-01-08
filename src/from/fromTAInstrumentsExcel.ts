import { Analysis } from '..';

import { parseTAInstrumentsExcel } from './parseTAInstrumentsExcel';

export function fromTAInstrumentsExcel(arrayBuffer: ArrayBuffer | Uint8Array) {
  const analysis = new Analysis();
  const parsed = parseTAInstrumentsExcel(arrayBuffer);

  analysis.pushSpectrum(
    {
      x: {
        data: parsed.temperature,
        isDependent: true,
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.weight,
        isDependent: true,
        label: 'Weight [mg]',
      },
      z: {
        data: parsed.weightPercent,
        isDependent: true,
        label: 'Weight [%]',
      },
      t: {
        data: parsed.time,
        isDependent: false,
        label: 'Time [s]',
      },
    },
    { dataType: 'TGA', title: parsed.meta.sampleName, meta: parsed.meta },
  );

  return analysis;
}
