import { fromJSON } from 'convert-to-jcamp';

export default function toJcamp(spectrum) {
  let jcamps = [];
  let weightVersusTemperature = spectrum.get('weightVersusTemperature');
  if (weightVersusTemperature) {
    jcamps.push(getJcamp(weightVersusTemperature));
  }
  let weightVersusTime = spectrum.get('weightVersusTime');
  if (weightVersusTime) {
    jcamps.push(getJcamp(weightVersusTime));
  }
  return jcamps.join('\n');
}

function getJcamp(spectrum) {
  let options = {
    xUnit: spectrum.xLabel,
    yUnit: spectrum.yLabel,
    title: spectrum.title,
    type: 'TGA',
    info: spectrum.meta,
  };
  return fromJSON({ x: spectrum.x, y: spectrum.y }, options);
}
