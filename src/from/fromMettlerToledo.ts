//@ts-expect-error imported library
import { tgaParseMettlerToledo } from 'physical-chemistry-parser';

import { Analysis } from '..';

export function fromMettlerToledo(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  let analysis = new Analysis();

  const results: any[] = tgaParseMettlerToledo(arrayBuffer);

  // we try to find the right results
  const result = results.filter(
    (result) =>
      result.variables?.y &&
      (result.variables.y.units === 'mg' || result.variables.y.units === '%'),
  )[0];

  const cheminfo = { meta: result.meta };

  analysis.pushSpectrum(result.variables, {
    dataType: 'TGA',
    meta: { ...result.meta, cheminfo },
  });

  return analysis;
}
