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

  const jcamp = toJcamp(analysis)
    .split(/\r?\n/)
    .filter((line) => line.match(/##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/));

  expect(jcamp).toStrictEqual([
    '##VAR_NAME=  Program temperature,Weight,Time',
    '##SYMBOL=    x,y,t',
    '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
    '##UNITS=     °C,mg,min',
  ]);

  const spectrum = analysis.getXYSpectrum();

  expect(Object.keys(spectrum.variables)).toStrictEqual(['x', 'y']);

  expect(spectrum.meta.sampleName).toBe('Cryo1-1_N1-2@25C');
  expect(spectrum.title).toBe('Cryo1-1_N1-2@25C');
  expect(spectrum.variables.x.data[0]).toStrictEqual(22.70189);
  expect(spectrum.variables.x.data).toHaveLength(15577);
  expect(spectrum.variables.x.data[15576]).toStrictEqual(25.00298);
  expect(spectrum.variables.y.data).toHaveLength(15577);
  expect(spectrum.meta.methodSteps).toHaveLength(10);
});

test('fromTAInstruments test 2', () => {
  let file = readFileSync(
    join(__dirname, '../../../testFiles/mof.txt'),
    'utf16le',
  );

  const analysis = fromTAInstruments(file);

  const jcamp = toJcamp(analysis)
    .split(/\r?\n/)
    .filter((line) => line.match(/##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/));

  expect(jcamp).toStrictEqual([
    '##VAR_NAME=  Program temperature,Weight,Time',
    '##SYMBOL=    x,y,t',
    '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
    '##UNITS=     °C,mg,min',
  ]);

  const spectrum = analysis.getXYSpectrum();

  expect(Object.keys(spectrum.variables)).toStrictEqual(['x', 'y']);

  expect(spectrum.meta.sampleName).toBe('Fe-BTC Grade A act');
  expect(spectrum.title).toBe('Fe-BTC Grade A act');
  expect(spectrum.variables.x.data[0]).toStrictEqual(46.87907);
  expect(spectrum.variables.x.data).toHaveLength(18995);
  expect(spectrum.variables.x.data[18994]).toStrictEqual(797.8466);
  expect(spectrum.variables.y.data).toHaveLength(18995);
  expect(spectrum.meta.methodSteps).toHaveLength(3);
});

test('fromTAInstruments test 3', () => {
  let file = readFileSync(
    join(
      __dirname,
      '../../../testFiles/engarcia_CPR-11_JCRN_180925-cpr-1=1@100c.txt',
    ),
    'utf16le',
  );

  const analysis = fromTAInstruments(file);

  const jcamp = toJcamp(analysis)
    .split(/\r?\n/)
    .filter((line) => line.match(/##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/));

  expect(jcamp).toStrictEqual([
    '##VAR_NAME=  Program temperature,Weight,Time',
    '##SYMBOL=    x,y,t',
    '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
    '##UNITS=     °C,mg,min',
  ]);

  const spectrum = analysis.getXYSpectrum();

  expect(Object.keys(spectrum.variables)).toStrictEqual(['x', 'y']);

  expect(spectrum.meta.sampleName).toBe('180925_CPR 1-1@100C');
  expect(spectrum.title).toBe('180925_CPR 1-1@100C');
  expect(spectrum.variables.x.data[0]).toStrictEqual(40.59913);
  expect(spectrum.variables.x.data).toHaveLength(11857);
  expect(spectrum.variables.x.data[11856]).toStrictEqual(49.58992);
  expect(spectrum.variables.y.data).toHaveLength(11857);
  expect(spectrum.meta.methodSteps).toHaveLength(13);
});
