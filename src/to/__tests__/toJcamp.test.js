import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmer } from '../..';

test('toJcamp', () => {
  let text = readFileSync(
    join(__dirname, '../../../testFiles/tga4000_perkinElmer.txt'),
    'latin1',
  );
  const spectrum = fromPerkinElmer(text);
  const jcamp = spectrum.toJcamp();
  let lines = jcamp.split(/\n/);
  let points = lines.filter((line) => line.match('##NPOINTS=1155'));
  expect(points).toHaveLength(2);
  let titles = lines.filter((line) => line.match('##TITLE=HMm-1130'));
  expect(titles).toHaveLength(2);
  let ends = lines.filter((line) => line.match('##END'));
  expect(ends).toHaveLength(2);
});
