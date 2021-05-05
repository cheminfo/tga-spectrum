import { ensureString } from 'ensure-string';

import { Analysis } from '..';

const mapping = {
  INSTRUMENT: 'intrumentName',
  'DATE/TIME': 'date',
  'SAMPLE MASS': 'sampleWeight',
};

export function fromNetzsch(blob) {
  const text = ensureString(blob, { encoding: 'iso8859-1' });
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
      parsed.meta[mapping[label] || label] = value;
    }
  }

  let analysis = new Analysis();
  analysis.pushSpectrum(parsed.variables, {
    meta: parsed.meta,
    dataType: 'TGA',
  });

  return analysis;
}
