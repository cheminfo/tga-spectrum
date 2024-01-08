import { Analysis, Spectrum } from 'common-spectrum';
import { ensureString } from 'ensure-string';

export function fromNetzsch(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
): Analysis {
  const text = ensureString(arrayBuffer, { encoding: 'iso8859-1' });
  const lines = text.split(/\r?\n/).filter((line) => line);
  const parsed: Spectrum<number[]> = {
    meta: {},
    variables: {
      x: {
        data: [],
        label: 'Sample temperature [°C]',
        isDependent: true,
      },
      y: {
        data: [],
        label: 'Weight [mg]',
        isDependent: true,
      },
      t: {
        data: [],
        label: 'Time [min]',
        isDependent: false,
      },
    },
  };
  let inData = false;
  for (const line of lines) {
    if (inData) {
      const [temperature, time, weight] = line.split(';').map(parseFloat);
      parsed.variables.x.data.push(temperature);
      parsed.variables.y.data.push(weight);
      // @ts-expect-error can have errors
      parsed.variables.t.data.push(time);
    } else if (line.startsWith('##')) {
      inData = true;
    } else {
      const groups = /#(?<label>.*?):(?<value>.*)/.exec(line)?.groups;
      if (!groups) throw new Error('TGA Netzsch parsing error');
      const { label, value } = groups;
      // @ts-expect-error can have errors
      parsed.meta[label] = value;
    }
  }

  // @ts-expect-error can have errors
  const mass = parseFloat(parsed.meta['SAMPLE MASS /mg']);
  parsed.variables.y.data = parsed.variables.y.data.map((i) => {
    return (i / 100) * mass;
  });
  const analysis = new Analysis();
  analysis.pushSpectrum(parsed.variables, {
    meta: parsed.meta,
    dataType: 'TGA',
  });

  return analysis;
}
