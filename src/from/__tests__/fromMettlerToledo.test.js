import { readFileSync } from 'fs';
import { join } from 'path';

import { fromMettlerToledo } from '../fromMettlerToledo.js';

describe('fromMettlerToledo', () => {
  it('Absolute weight', () => {
    const arrayBuffer = readFileSync(
      join(__dirname, '../../../testFiles/mettlerToledoWeight.txt'),
    );

    const results = fromMettlerToledo(arrayBuffer);

    return;
    expect(result.meta).toMatchSnapshot();
    expect(result.jcamp).toBeDefined();
    expect(result.jcamp).toContain('##DATA TYPE=TGA');

    const parsed = fromMettlerToledo(result.jcamp, { keepRecordsRegExp: /.*/ })
      .flatten[0];

    expect(parsed.ntuples).toStrictEqual([
      {
        varname: 'Temperature',
        symbol: 'x',
        vartype: 'DEPENDENT',
        vardim: 2251,
        units: '°C',
      },
      {
        varname: 'Weight',
        symbol: 'y',
        vartype: 'DEPENDENT',
        vardim: 2251,
        units: 'mg',
      },
      {
        varname: 'Time',
        symbol: 't',
        vartype: 'INDEPENDENT',
        vardim: 2251,
        units: 's',
      },
    ]);
  });
});
