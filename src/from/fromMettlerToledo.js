import { tgaParseMettlerToledo } from 'physical-chemistry-parser';

import { Analysis } from '..';

export function fromMettlerToledo(arrayBuffer = '', options = {}) {
  let analysis = new Analysis();

  const results = tgaParseMettlerToledo(arrayBuffer);

  // we try to find the right results
  const result = results.filter(
    (result) =>
      result.variables &&
      result.variables.y &&
      (result.variables.y.units === 'mg' || result.variables.y.units === '%'),
  )[0];

  const cheminfo = result.meta;

  analysis.pushSpectrum(result.variables, {
    dataType: 'TGA',
    meta: { ...result.meta, cheminfo },
  });

  return analysis;
}
