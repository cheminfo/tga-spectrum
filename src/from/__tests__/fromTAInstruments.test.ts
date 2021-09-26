import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp } from 'common-spectrum';

import { fromTAInstruments } from '../fromTAInstruments';

describe('fromTAInstruments', () => {
  it('TAInstruments.txt', () => {
    let file = readFileSync(
      join(__dirname, '../../../testFiles/TAInstruments.txt'),
    );

    const analysis = fromTAInstruments(file);

    const jcamp = toJcamp(analysis)
      .split(/\r?\n/)
      .filter((line) => /##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/.exec(line));

    expect(jcamp).toStrictEqual([
      '##VAR_NAME=  Program temperature,Weight,Time',
      '##SYMBOL=    x,y,t',
      '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
      '##UNITS=     °C,mg,min',
    ]);

    const spectrum = analysis.getXYSpectrum();

    if (!spectrum || !spectrum.meta) {
      throw new Error('could not retrieve spectrum with meta');
    }
    expect(Object.keys(spectrum.variables)).toStrictEqual(['x', 'y']);

    expect(spectrum.meta.sampleName).toBe('Cryo1-1_N1-2@25C');
    expect(spectrum.title).toBe('Cryo1-1_N1-2@25C');
    expect(spectrum.variables.x.data[0]).toStrictEqual(22.70189);
    expect(spectrum.variables.x.data).toHaveLength(15577);
    expect(spectrum.variables.x.data[15576]).toStrictEqual(25.00298);
    expect(spectrum.variables.y.data).toHaveLength(15577);
    expect(spectrum.meta.methodSteps).toHaveLength(10);
  });

  it('mof.txt', () => {
    let file = readFileSync(join(__dirname, '../../../testFiles/mof.txt'));

    const analysis = fromTAInstruments(file);

    const jcamp = toJcamp(analysis)
      .split(/\r?\n/)
      .filter((line) => /##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/.exec(line));

    expect(jcamp).toStrictEqual([
      '##VAR_NAME=  Program temperature,Weight,Time',
      '##SYMBOL=    x,y,t',
      '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
      '##UNITS=     °C,mg,min',
    ]);

    const spectrum = analysis.getXYSpectrum();
    if (!spectrum || !spectrum.meta) {
      throw new Error('could not retrieve spectrum with meta');
    }

    expect(Object.keys(spectrum.variables)).toStrictEqual(['x', 'y']);

    expect(spectrum.meta.sampleName).toBe('Fe-BTC Grade A act');
    expect(spectrum.title).toBe('Fe-BTC Grade A act');
    expect(spectrum.variables.x.data[0]).toStrictEqual(46.87907);
    expect(spectrum.variables.x.data).toHaveLength(18995);
    expect(spectrum.variables.x.data[18994]).toStrictEqual(797.8466);
    expect(spectrum.variables.y.data).toHaveLength(18995);
    expect(spectrum.meta.methodSteps).toHaveLength(3);
  });
});
