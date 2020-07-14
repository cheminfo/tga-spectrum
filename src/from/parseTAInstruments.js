import Papa from 'papaparse';

function parseMeta(lines) {
  let meta = { comments: [], methodSteps: [] };
  for (let [i, line] of lines.entries()) {
    if (line.match(/^Instrument/)) {
      meta.instrument = splitTrim(line);
    } else if (line.match(/^InstSerial/)) {
      meta.instrumentSerial = splitTrim(line);
    } else if (line.match(/^Sample/)) {
      meta.sampleName = splitTrim(line);
    } else if (line.match(/^Size/)) {
      meta.weight = parseFloat(splitTrim(line));
      meta.weightUnit = splitTrim(line, 2);
    } else if (line.match(/^Xcomment|^Comment/)) {
      meta.comments.push(splitTrim(line));
    } else if (line.match(/^Method/)) {
      meta.method = splitTrim(line);
    } else if (line.match(/^Mode/)) {
      meta.mode = splitTrim(line);
    } else if (line.match(/^File/)) {
      meta.file = splitTrim(line);
    } else if (line.match(/^Date/)) {
      meta.date = splitTrim(line);
    } else if (line.match(/^Time/)) {
      meta.time = splitTrim(line);
    } else if (line.match(/^OrgMethod/)) {
      meta.methodSteps.push(splitTrim(line));
    } else if (line.match(/^Controls/)) {
      meta.controls = splitTrim(line);
    } else if (line.match(/^FurnaceType/)) {
      meta.furnaceType = splitTrim(line);
    } else if (line.match(/^Operator/)) {
      meta.operator = splitTrim(line);
    } else if (line.match(/^RunSerial/)) {
      meta.runSerial = splitTrim(line);
    } else if (line.match(/^ProcName/)) {
      meta.procName = splitTrim(line);
    } else if (line.match(/^StartOfData/)) {
      meta.dataStart = i + 1;
      break;
    }
  }

  return meta;
}

export function parseTAInstruments(text) {
  let lines = text.split(/\r?\n/).filter((line) => !line.match(/^\s*$/));

  let meta = parseMeta(lines);
  let parsed = Papa.parse(
    lines.slice(meta.dataStart, lines.length).join('\n'),
    {
      skipEmptyLines: true,
      dynamicTyping: false,
    },
  ).data;

  // Need the map to number because papa failed with some scientific notation cases.
  // I do not know the overhead of 'dynamicTyping' but I turned it now off for just that reason
  const arrayColumn = (arr, n) => arr.map((x) => x[n]).map(Number);

  meta.balancePurgeFlow = [];
  meta.samplePurgeFlow = [];
  // We now assume that we always have 5 columns in the same order ...
  let result = {
    meta: meta,
    data: {
      time: [],
      weight: [],
      temperature: [],
    },
  };
  result.data.time = arrayColumn(parsed, 0);
  result.data.temperature = arrayColumn(parsed, 1);
  result.data.weight = arrayColumn(parsed, 2);
  result.meta.balancePurgeFlow = arrayColumn(parsed, 3);
  result.meta.samplePurgeFlow = arrayColumn(parsed, 4);

  return result;
}

function splitTrim(string, item = 1) {
  return string.split(/\t/)[item].replace(/^[ \t]*(.*?)[ \t]*$/, '$1');
}
