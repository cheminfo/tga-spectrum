import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assert, expect, test } from 'vitest';

import { fromTAInstrumentsExcel } from '../fromTAInstrumentsExcel.ts';

test('import from TA instruments excel file', () => {
  const data = readFileSync(
    join(import.meta.dirname, './data/190307-ALP-DMF@100%-TPD-2.xls'),
  );

  const analysis = fromTAInstrumentsExcel(data);

  expect(analysis.spectra).toHaveLength(10);

  const firstSpectrum = analysis.spectra[0];
  assert(firstSpectrum !== undefined);

  expect(Object.keys(firstSpectrum.variables)).toStrictEqual([
    't',
    'x',
    'y',
    'z',
  ]);

  const variables = firstSpectrum.variables;

  expect(variables.x.data).toHaveLength(71636);
  expect(variables.y.data).toHaveLength(71636);
  expect(variables.z?.data).toHaveLength(71636);
  expect(variables.t?.data).toHaveLength(71636);
  expect(variables.x.data[0]).toBe(25.77);
  expect(variables.x.data[71625]).toBe(169.93);
});
