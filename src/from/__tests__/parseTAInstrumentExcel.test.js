import { readFileSync } from 'fs';
import { join } from 'path';

import { parseTAInstrumentsExcel, testables } from '../parseTAInstrumentsExcel';

let xlsx = require('xlsx');

const { parseMeta } = testables;

describe('TA instrument excel parser', () => {
  let data = readFileSync(
    join(__dirname, '../../../testFiles/190307-ALP-DMF@100%-TPD-2.xls'),
  );

  const workbook = xlsx.read(data);
  it('meta parsing', () => {
    let meta = parseMeta(workbook.Sheets.Details);
    expect(meta.fileName).toStrictEqual('190307-ALP-DMF@100%-TPD');
    expect(meta.instrumentName).toStrictEqual('TGA5500 (172.23.164.55)');
    expect(meta.procedure).toHaveLength(12);
    expect(meta.sampleWeight).toStrictEqual(5.977);
    expect(meta.sampleWeightUnit).toStrictEqual('mg');
  });
});
