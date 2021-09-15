import { ensureString } from 'ensure-string';

import { Analysis } from '..';

export function fromNetzsch(arrayBuffer: string | ArrayBuffer) {
  const text = ensureString(arrayBuffer, { encoding: 'iso8859-1' });
  let lines = text.split(/\r?\n/).filter((line) => line);
  let parsed = {
    meta: {},
    variables: {
      x: {
        data: [],
        label: 'Sample temperature [°C]',
        type: 'dependent',
      },
      y: {
        data: [],
        label: 'Weight [mg]',
        type: 'dependent',
      },
      t: {
        data: [],
        label: 'Time [min]',
        type: 'independent',
      },
    },
  };
  let inData = false;
  for (let line of lines) {
    if (inData) {
      const [temperature, time, weight] = line.split(';').map(parseFloat);
      parsed.variables.x.data.push(temperature);
      parsed.variables.y.data.push(weight);
      parsed.variables.t.data.push(time);
    } else if (line.startsWith('##')) {
      inData = true;
    } else {
      const { label, value } = line.match(/#(?<label>.*?):(?<value>.*)/).groups;
      parsed.meta[label] = value;
    }
  }

  const mass = parseFloat(parsed.meta['SAMPLE MASS /mg']);
  parsed.variables.y.data = parsed.variables.y.data.map((i) => {
    return i * mass;
  });
  let analysis = new Analysis();
  analysis.pushSpectrum(parsed.variables, {
    meta: parsed.meta,
    dataType: 'TGA',
  });

  return analysis;
}
