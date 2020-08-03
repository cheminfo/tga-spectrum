import { readFileSync } from 'fs';
import { join } from 'path';
import { toJcamp } from 'common-spectrum';
import { fromTAInstruments } from '../fromTAInstruments';

test('fromTAInstruments', () => {
  let file = readFileSync(
    join(__dirname, '../../../testFiles/TAInstruments.txt'),
    'utf16le',
  );

  const analysis = fromTAInstruments(file);
  const spectra = analysis.getSpectra();

  const jcamp = toJcamp(analysis)
    .split(/\r?\n/)
    .filter((line) => line.match(/##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/));

  expect(jcamp).toStrictEqual([
    '##VAR_NAME=  Program temperature,Weight,Time',
    '##SYMBOL=    x,y,t',
    '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
    '##UNITS=     °C,mg,s',
  ]);

  expect(Object.keys(spectra[0].variables)).toStrictEqual(['x', 'y', 't']);

  expect(spectra[0].meta.sampleName).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[0].title).toBe('Cryo1-1_N1-2@25C');
  expect(spectra[0].variables.x.data[0]).toStrictEqual(22.70189);
  expect(spectra[0].variables.x.data).toHaveLength(15577);
  expect(spectra[0].variables.x.data[15576]).toStrictEqual(25.00298);
  expect(spectra[0].variables.y.data).toHaveLength(15577);
  expect(spectra[0].meta.methodSteps).toHaveLength(10);
});
