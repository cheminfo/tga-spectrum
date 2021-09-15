import { readFileSync } from 'fs';
import { join } from 'path';

import { fromTAInstrumentsExcel } from '../fromTAInstrumentsExcel';

test('import from TA instruments excel file', () => {
  let data = readFileSync(
    join(__dirname, '../../../testFiles/190307-ALP-DMF@100%-TPD-2.xls'),
  );

  const output = fromTAInstrumentsExcel(data);
  expect(output.spectra).toHaveLength(1);
  expect(Object.keys(output.spectra[0].variables)).toStrictEqual([
    'x',
    'y',
    'z',
    't',
  ]);
  expect(output.spectra[0].variables.x.data).toHaveLength(71627);
  expect(output.spectra[0].variables.y.data).toHaveLength(71627);
  expect(output.spectra[0].variables.z.data).toHaveLength(71627);
  expect(output.spectra[0].variables.t.data).toHaveLength(71627);
  expect(output.spectra[0].variables.x.data[0]).toStrictEqual(25.77);
  expect(output.spectra[0].variables.x.data[71625]).toStrictEqual(169.93);
});
