import type { MeasurementVariable, TextData } from 'cheminfo-types';
import { ensureString } from 'ensure-string';

export function parsePerkinElmerAscii(blob: TextData) {
  const sections = getSections(blob);
  return sections;
}

type Sections =
  | 'header'
  | 'methodSteps'
  | 'dataFirstLine'
  | 'dataHeader'
  | 'data'
  | 'endData'
  | 'footer';

interface MethodStep {
  id: number;
  label: string;
  description: string;
  variables: Array<MeasurementVariable<number[]>>;
}

interface Section {
  header: Record<string, string>;
  methodSteps: {
    info: string[];
    steps: MethodStep[];
  };
  footer: string;
}

function getSections(blob: TextData) {
  const result: Section = {
    header: {} as Record<string, string>,
    methodSteps: {
      info: [] as string[],
      steps: [] as MethodStep[],
    },
    footer: '' as string,
  };
  const text = ensureString(blob);
  const lines = text.split(/\r?\n/);

  let currentSection: Sections = 'header';
  let currentStep: MethodStep = {
    id: 0,
    label: '',
    description: '',
    variables: [],
  };
  let dataHeaders: Array<MeasurementVariable<number[]>> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('Method Steps:')) {
      currentSection = 'methodSteps';
      continue;
    }
    if (
      currentSection === 'methodSteps' &&
      line.startsWith('1)') &&
      result.methodSteps.steps.length > 0
    ) {
      currentSection = 'dataFirstLine';
    }

    switch (currentSection) {
      case 'header':
        {
          const [key, ...rest] = line.split(':').map((s) => s.trim());
          const value = rest.join(':');
          if (key && value.length > 0) {
            result.header[key] = value;
          }
        }
        break;
      case 'methodSteps':
        if (line.match(/^[0-9]/)) {
          // 1)	Hold for 1.0 min at 50.00�C
          const match = line.match(/^([0-9]+)\)\s+/);
          if (match) {
            result.methodSteps.steps.push({
              id: Number.parseInt(match[1], 10),
              label: line.replace('\t', ' ').trim(),
              description: '',
              variables: [],
            });
          }
        } else {
          if (line.trim() === '') continue;
          result.methodSteps.info.push(line.replaceAll('\t', '  '));
        }
        break;
      case 'dataFirstLine':
        {
          const { step, description } = parseDataBlockHeader(line, result);
          currentStep = step;
          currentStep.description = description;
          currentSection = 'dataHeader';
        }
        break;
      case 'dataHeader':
        dataHeaders = parseDataHeader(line, lines[i + 1]);
        i++;
        currentSection = 'data';
        currentStep.variables = structuredClone(dataHeaders);
        break;
      case 'data':
        if (line.trim() === '') {
          currentSection = 'endData';
          continue;
        }
        if (line.match(/^[0-9+]\)/)) {
          // new data block
          const { description, step } = parseDataBlockHeader(line, result);
          currentStep = step;
          currentStep.variables = structuredClone(dataHeaders);
          currentStep.description = description;
        } else {
          const dataParts = line
            .split('\t')
            .map((s) => s.trim())
            .map(Number);
          if (dataParts.length !== currentStep?.variables.length) {
            throw new Error(
              `Data length mismatch in step ${currentStep?.id}: expected ${currentStep?.variables.length}, got ${dataParts.length}`,
            );
          }
          for (let j = 0; j < dataParts.length; j++) {
            currentStep?.variables[j].data.push(dataParts[j]);
          }
        }
        break;
      case 'endData':
        if (line.trim() === '') {
          continue;
        }
        currentSection = 'footer';
        break;
      case 'footer': {
        result.footer += `${line}\n`;
        break;
      }
      default:
        break;
    }
  }
  return result;
}

function parseDataBlockHeader(line: string, result: Section) {
  const match = line.match(/^([0-9]+)\) (.+)/);
  if (!match) {
    throw new Error(`Could not parse data block header line: ${line}`);
  }
  const id = Number.parseInt(match[1], 10);
  // find the corresponding step
  const step = result.methodSteps.steps.find((s) => s.id === id);
  if (!step) {
    throw new Error(`Could not find method step for data block id: ${id}`);
  }
  return {
    id,
    description: match[2].trim(),
    step,
  };
}

/**
 * need to combine both lines to get the full header information as an array
 * @param line
 * @param nextLine
 */
function parseDataHeader(
  line: string,
  nextLine: string,
): Array<MeasurementVariable<number[]>> {
  const firstLineParts = line.split('\t').map((s) => s.trim());
  const secondLineParts = nextLine.split('\t').map((s) => s.trim());
  const combined: string[] = [];
  for (let i = 0; i < firstLineParts.length; i++) {
    let combinedHeader = firstLineParts[i];
    if (i < secondLineParts.length && secondLineParts[i] !== '') {
      combinedHeader += ` ${secondLineParts[i]}`;
    }
    combined.push(combinedHeader);
  }
  return combined.map((label) => ({ label, data: [] }));
}
