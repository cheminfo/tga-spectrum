import type { TextData } from 'cheminfo-types';
import { ensureString } from 'ensure-string';

import { Analysis } from '../index.ts';

import { parsePerkinElmerAscii } from './parser/parsePerkinElmerAscii.ts';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param text - String containing the JCAMP data
 * @param arrayBuffer
 * @returns - New class element with the given data
 */
export function fromPerkinElmer(arrayBuffer: TextData) {
  const text = ensureString(arrayBuffer);
  const analysis = new Analysis();
  const parsed = parsePerkinElmerAscii(text);

  const meta: Record<string, unknown> = {
    ...parsed.header,
    stepsInfo: parsed.methodSteps.info,
    methodSteps: parsed.methodSteps.steps.map((step) => step.label),
    footer: parsed.footer,
  };

  const firstStep = parsed.methodSteps.steps[0];
  if (!firstStep) {
    return analysis;
  }
  const variables = firstStep.variables;
  for (let i = 1; i < parsed.methodSteps.steps.length; i++) {
    const stepVariable = parsed.methodSteps.steps[i]?.variables;
    if (!stepVariable) continue;
    for (let j = 0; j < variables.length; j++) {
      const variable = variables[j];
      const stepVar = stepVariable[j];
      if (variable?.data && stepVar?.data) {
        variable.data = variable.data.concat(stepVar.data);
      }
    }
  }

  analysis.pushSpectrum(
    {
      x: {
        data:
          variables.find((v) => v.label.startsWith('Sample Temperature'))
            ?.data || [],
        label: 'Temperature [°C]',
      },
      y: {
        data:
          variables.find((v) => v.label.startsWith('Unsubtracted Weight'))
            ?.data || [],
        label: 'Weight [mg]',
      },
    },
    {
      dataType: 'TGA',
      title: (meta['Sample ID'] as string) || '',
      meta,
    },
  );
  analysis.pushSpectrum(
    {
      x: {
        data: variables.find((v) => v.label.startsWith('Time'))?.data || [],
        label: 'Time [min]',
      },
      y: {
        data:
          variables.find((v) => v.label.startsWith('Unsubtracted Weight'))
            ?.data || [],
        label: 'Weight [mg]',
      },
    },
    {
      dataType: 'TGA',
      title: (meta['Sample ID'] as string) || '',
      meta,
    },
  );

  return analysis;
}
