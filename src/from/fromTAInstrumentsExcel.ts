//@ts-expect-error imported library
import { tgaParseTAInstrumentsXLS } from 'physical-chemistry-parser';

import { Analysis } from '../index.ts';
import type { TGACheminfo } from '../types/TGACheminfo.ts';

/**
 * Parse a TA Instruments Excel TGA export.
 * @param arrayBuffer - Raw binary data from the TA Instruments Excel file.
 * @returns An Analysis instance containing the parsed TGA spectra.
 */
export function fromTAInstrumentsExcel(arrayBuffer: ArrayBuffer | Uint8Array) {
  const analysis = new Analysis();
  const parsed = tgaParseTAInstrumentsXLS(arrayBuffer);

  const cheminfo: TGACheminfo = { meta: { method: 'Full' } };

  analysis.pushSpectrum(parsed.variables, {
    dataType: 'TGA',
    title: parsed.meta['Sample name'],
    meta: {
      ...parsed.meta,
      cheminfo,
    },
  });

  for (const sheet of parsed.sheets) {
    const sheetCheminfo: TGACheminfo = { meta: { method: sheet.name } };
    analysis.pushSpectrum(sheet.variables, {
      dataType: 'TGA',
      title: parsed.meta['Sample name'],
      meta: {
        ...parsed.meta,
        cheminfo: sheetCheminfo,
      },
    });
  }

  return analysis;
}
