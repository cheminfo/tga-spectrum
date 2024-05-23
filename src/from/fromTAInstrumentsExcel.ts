//@ts-expect-error imported library
import { tgaParseTAInstrumentsXLS } from 'physical-chemistry-parser';

import { Analysis } from '..';

export function fromTAInstrumentsExcel(arrayBuffer: ArrayBuffer | Uint8Array) {
  const analysis = new Analysis();
  const parsed = tgaParseTAInstrumentsXLS(arrayBuffer);

  analysis.pushSpectrum(parsed.variables, {
    dataType: 'TGA',
    title: parsed.meta['Sample name'],
    meta: parsed.meta,
  });

  return analysis;
}
