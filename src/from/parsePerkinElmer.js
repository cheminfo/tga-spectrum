export function parsePerkinElmer(text) {
  let lines = text.split(/[\r\n]+/);
  let result = { meta: {}, data: { time: [], weight: [], temperature: [] } };
  let section = '';
  let inMethodSteps = false;
  for (let line of lines) {
    if (inMethodSteps) {
      if (line.startsWith('1) TGA')) {
        inMethodSteps = false;
      } else {
        if (!result.meta['Method Steps']) result.meta['Method Steps'] = '';
        result.meta['Method Steps'] += `${line.replace(/\t/g, '  ')}\n`;
      }
    } else if (line.match(/^[a-zA-Z -]+$/)) {
      section = trim(line);
    } else if (line.match(/.*:.*/)) {
      let position = line.indexOf(':');
      let description = line.substring(0, position);
      let value = trim(line.substring(position + 1));
      result.meta[(section ? `${section}_` : '') + description] = value;
    } else if (line.match(/^[0-9\t .]+$/)) {
      let fields = line.replace(/^\t/, '').split('\t');
      result.data.time.push(Number(fields[0]));
      result.data.weight.push(Number(fields[1]));
      result.data.temperature.push(Number(fields[4]));
    } else {
      //  console.log('Problem: ', line);
    }
    if (line.startsWith('Method Steps:')) {
      inMethodSteps = true;
    }
  }
  return result;
}

function trim(string) {
  return string.replace(/^[ \t]*(.*?)[ \t]*$/, '$1');
}
