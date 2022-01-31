import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/jcamp.jdx'),
    'utf8',
  );
  let analysis = fromJcamp(jcamp);

  let spectrum1 = analysis.getXYSpectrum();

  if (!spectrum1) throw new Error('Could not getXYSpectrum');
  expect(spectrum1.variables.x.data).toHaveLength(2251);
  expect(spectrum1.variables.y.data).toHaveLength(2251);
  expect(spectrum1.variables.x.label).toBe('Ts');
  expect(spectrum1.variables.x.units).toBe('°C');
  expect(spectrum1.variables.y.label).toBe('Value');
  expect(spectrum1.variables.y.units).toBe('mg');

  let spectrum2 = analysis.getXYSpectrum({ units: 'mg vs s' });

  // @ts-expect-error
  expect(spectrum2.variables.x.data).toHaveLength(2251);
  // @ts-expect-error
  expect(spectrum2.variables.y.data).toHaveLength(2251);
  // @ts-expect-error
  expect(spectrum2.variables.x.label).toBe('t');
  // @ts-expect-error
  expect(spectrum2.variables.y.label).toBe('Value');
});
