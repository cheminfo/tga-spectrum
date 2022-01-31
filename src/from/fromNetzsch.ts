import { Analysis, Spectrum } from 'common-spectrum';
import { ensureString } from 'ensure-string';

export function fromNetzsch(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
): Analysis {
  const text = ensureString(arrayBuffer, { encoding: 'iso8859-1' });
  let lines = text.split(/\r?\n/).filter((line) => line);
  let parsed: Spectrum<number[]> = {
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
  for (let line of lines) {
    if (inData) {
      const [temperature, time, weight] = line.split(';').map(parseFloat);
      parsed.variables.x.data.push(temperature);
      parsed.variables.y.data.push(weight);
      // @ts-ignore
      parsed.variables.t.data.push(time);
    } else if (line.startsWith('##')) {
      inData = true;
    } else {
      const groups = /#(?<label>.*?):(?<value>.*)/.exec(line)?.groups;
      if (!groups) throw new Error('TGA Netzsch parsing error');
      const { label, value } = groups;
      // @ts-expect-error
      parsed.meta[label] = value;
    }
  }

  // @ts-expect-error
  const mass = parseFloat(parsed.meta['SAMPLE MASS /mg']);
  parsed.variables.y.data = parsed.variables.y.data.map((i) => {
    return (i / 100) * mass;
  });
  let analysis = new Analysis();
  analysis.pushSpectrum(parsed.variables, {
    meta: parsed.meta,
    dataType: 'TGA',
  });

  // @ts-ignore
  return analysis;
}
