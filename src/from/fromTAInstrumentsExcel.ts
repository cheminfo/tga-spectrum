//@ts-expect-error imported library
import { tgaParseTAInstrumentsXLS } from 'physical-chemistry-parser';

import { Analysis } from '../index.js';

export function fromTAInstrumentsExcel(arrayBuffer: ArrayBuffer | Uint8Array) {
  const analysis = new Analysis();
  const parsed = tgaParseTAInstrumentsXLS(arrayBuffer);

  analysis.pushSpectrum(parsed.variables, {
    dataType: 'TGA',
    title: parsed.meta['Sample name'],
    meta: {
      ...parsed.meta,
      cheminfo: {
        meta: {
          method: 'Full',
        },
      },
    },
  });

  for (const sheet of parsed.sheets) {
    analysis.pushSpectrum(sheet.variables, {
      dataType: 'TGA',
      title: parsed.meta['Sample name'],
      meta: {
        ...parsed.meta,
        cheminfo: {
          meta: {
            method: sheet.name,
          },
        },
      },
    });
  }

  return analysis;
}
