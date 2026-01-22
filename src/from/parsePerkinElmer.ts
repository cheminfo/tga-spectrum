import { ensureString } from 'ensure-string';

export function parsePerkinElmer(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  const text = ensureString(arrayBuffer);
  const lines = text.split(/[\r\n]+/);
  const result: any = {
    meta: { methodSteps: [] },
    data: { time: [], weight: [], temperature: [] },
  };
  let section = '';
  let inMethodSteps = false;
  for (const line of lines) {
    if (inMethodSteps) {
      if (line.startsWith('1) TGA')) {
        inMethodSteps = false;
      } else if (!line.startsWith('\t') && line.length > 2) {
        result.meta.methodSteps.push(line.replaceAll(/\t\n,+$/g, ''));
      }
    } else if (/^[a-zA-Z -]+$/.exec(line)) {
      section = trim(line);
    } else if (/.*:.*/.exec(line)) {
      const position = line.indexOf(':');
      const description = line.slice(0, Math.max(0, position));
      const value = trim(line.slice(Math.max(0, position + 1)));
      result.meta[(section ? `${section}_` : '') + description] = value;
    } else if (/^[0-9\t .]+$/.exec(line)) {
      const fields = line.replace(/^\t/, '').split('\t');
      result.data.time.push(Number(fields[0]) * 60);
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
function trim(string: string) {
  return string.replace(/^[ \t]*(.*?)[ \t]*$/, '$1');
}
