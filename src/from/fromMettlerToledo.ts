//@ts-expect-error imported library
import { tgaParseMettlerToledo } from 'physical-chemistry-parser';

import { Analysis } from '../index.js';

export function fromMettlerToledo(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  const analysis = new Analysis();

  const results: any[] = tgaParseMettlerToledo(arrayBuffer);

  // we try to find the right results
  const result = results.find(
    (result) =>
      result.variables?.y &&
      (result.variables.y.units === 'mg' || result.variables.y.units === '%'),
  );

  const cheminfo = { meta: result.meta };

  analysis.pushSpectrum(result.variables, {
    dataType: 'TGA',
    meta: { ...result.meta, cheminfo },
  });

  return analysis;
}
