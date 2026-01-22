import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromTAInstrumentsExcel } from '../fromTAInstrumentsExcel.js';

test('import from TA instruments excel file', () => {
  const data = readFileSync(
    join(
      import.meta.dirname,
      '../../../testFiles/190307-ALP-DMF@100%-TPD-2.xls',
    ),
  );

  const analysis = fromTAInstrumentsExcel(data);

  expect(analysis.spectra).toHaveLength(10);
  expect(Object.keys(analysis.spectra[0].variables)).toStrictEqual([
    't',
    'x',
    'y',
    'z',
  ]);

  const variables = analysis.spectra[0].variables;

  expect(variables.x.data).toHaveLength(71636);
  expect(variables.y.data).toHaveLength(71636);
  expect(variables.z?.data).toHaveLength(71636);
  expect(variables.t?.data).toHaveLength(71636);
  expect(variables.x.data[0]).toBe(25.77);
  expect(variables.x.data[71625]).toBe(169.93);
});
