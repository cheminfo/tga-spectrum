let xlsx = require('xlsx');

function valueElseUndefined(cell) {
  return cell ? cell.v : undefined;
}

function parseMeta(detailsSheet) {
  let meta = {};
  meta.fileName = valueElseUndefined(detailsSheet.B1);
  meta.instrumentName = valueElseUndefined(detailsSheet.B2);
  meta.operator = valueElseUndefined(detailsSheet.B3);
  meta.date = valueElseUndefined(detailsSheet.B8);
  meta.sampleName = valueElseUndefined(detailsSheet.B5);
  meta.procedure = valueElseUndefined(detailsSheet.B6)
    .split(';')
    .map(function (item) {
      return item.trim();
    });
  let mass = valueElseUndefined(detailsSheet.B16).split(' ');
  meta.sampleWeight = parseFloat(mass[0]);
  meta.sampleWeightUnit = mass[1].trim();
  meta.comments = valueElseUndefined(detailsSheet.B18);

  return meta;
}

export function parseTAInstrumentsExcel(data) {
  const workbook = xlsx.read(data);
  let meta = parseMeta(workbook.Sheets.Details);
}

export const testables = {
  parseMeta: parseMeta,
};
