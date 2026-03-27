import type { TGAMeta, TextData } from 'cheminfo-types';
// @ts-expect-error imported library for which we don't have types
import { tgaParseMettlerToledo } from 'physical-chemistry-parser';

import { Analysis } from '../index.ts';
import type { TGACheminfo } from '../types/TGACheminfo.ts';

/**
 * Parse a Mettler Toledo TGA text export.
 *
 * Unlike other parsers in this package, the Mettler Toledo format embeds
 * pre-computed zone information (mass-loss steps, inflection points, etc.)
 * produced by the instrument software. These zones are stored in
 * `spectrum.meta.cheminfo.meta.zones`.
 * @param arrayBuffer - Raw text data from the Mettler Toledo export file.
 * @returns An Analysis instance containing the parsed TGA spectrum.
 */
export function fromMettlerToledo(arrayBuffer: TextData) {
  const analysis = new Analysis();
  const results: any[] = tgaParseMettlerToledo(arrayBuffer);

  // we try to find the right results
  const result = results.find(
    (result) =>
      result.variables?.y &&
      (result.variables.y.units === 'mg' || result.variables.y.units === '%'),
  );

  const tgaMeta: TGAMeta = result.meta;
  const cheminfo: TGACheminfo = { meta: tgaMeta };

  analysis.pushSpectrum(result.variables, {
    dataType: 'TGA',
    meta: { ...result.meta, cheminfo },
  });

  return analysis;
}
