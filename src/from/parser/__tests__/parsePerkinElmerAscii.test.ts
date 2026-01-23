import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { parsePerkinElmerAscii } from '../parsePerkinElmerAscii.ts';

test('TGA parsePerkinElmerAscii', async () => {
  const blob = await readFile(
    join(import.meta.dirname, './data/tga/perkinElmer_tga4000.txt'),
  );
  const result = parsePerkinElmerAscii(blob);

  expect(Object.keys(result)).toStrictEqual([
    'header',
    'methodSteps',
    'footer',
  ]);
  expect(result.methodSteps.steps).toHaveLength(3);

  const step = result.methodSteps.steps[0];

  expect(step.variables).toHaveLength(8);
  expect(result).toMatchSnapshot();
});

test('DSC parsePerkinElmerAscii', async () => {
  const blob = await readFile(
    join(import.meta.dirname, './data/dsc/PerkinElmerAscii.txt'),
  );
  const result = parsePerkinElmerAscii(blob);

  expect(Object.keys(result)).toStrictEqual([
    'header',
    'methodSteps',
    'footer',
  ]);
  expect(result.methodSteps.steps).toHaveLength(2);

  const step = result.methodSteps.steps[0];

  expect(step.variables).toHaveLength(9);

  expect(result).toMatchSnapshot();
});
