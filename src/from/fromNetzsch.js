import { Analysis } from '..';

import { parseNetzsch } from './parseNetzsch.js';

export function fromNetzsch(text) {
  let analysis = new Analysis();
  const parsed = parseNetzsch(text);
  analysis.pushSpectrum(
    {
      x: {
        data: parsed.data.temperature,
        type: 'dependent',
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.data.mass,
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
