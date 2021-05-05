export function parseNetzsch(text) {
  text = text.replace(/(^[ \t]*\n)/gm, '');
  let lines = text.split(/[\r\n]+/);

  const meta = {};
  const data = { temperature: [], massPercent: [], time: [], mass: [] };
  let counter = 0;
  for (const line of lines) {
    if (line.match('SAMPLE')) {
      meta.sampleName = line.split(':')[1];
    }
    if (line.match('INSTRUMENT')) {
      meta.instrumentName = line.split(':')[1];
    }
    if (line.match('DATE/TIME:')) {
      meta.date = line.split(':')[1];
    }
    if (line.match('TEMPCAL')) {
      meta.tempCal = line.split(':')[1];
    }
    if (line.match('LABORATORY')) {
      meta.laboratory = line.split(':')[1];
    }
    if (line.match('Operator')) {
      meta.laboratory = line.split(':')[1];
    }
    if (line.match('SAMPLE MASS')) {
      meta.sampleWeight = parseFloat(line.split(':')[1]);
    }
    counter += 1;
    if (line.match('##')) {
      break;
    }
  }

  for (let i = counter; i < lines.length - 1; i++) {
    let parts = lines[i].split(';');
    data.temperature.push(parseFloat(parts[0]));
    data.time.push(parseFloat(parts[1]));
    data.massPercent.push(parseFloat(parts[2]));
    data.mass.push(meta.sampleWeight * parseFloat(parts[2]));
  }

  return { data: data, meta: meta };
}
