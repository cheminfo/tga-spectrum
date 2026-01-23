import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { test } from 'vitest';

import { parsePerkinElmerAscii } from '../parsePerkinElmerAscii.ts';

test('parsePerkinElmerAscii', async () => {
  const blob = await readFile(
    join(import.meta.dirname, './data/dsc/PerkinElmerAscii.txt'),
  );
  const result = parsePerkinElmerAscii(blob);
  console.log(result);
});
