import { convert } from 'jcampconverter';

export default function addJcamp(spectrum, jcamp) {
  const converted = convert(jcamp, {
    xy: true,
    keepRecordsRegExp: /.*/,
    canonicDataLabels: false,
    dynamicTyping: true,
  });

  let currentSpectrum = converted.spectra[0];
  for (let oneSpectrum of converted.spectra) {
    let xLabel = currentSpectrum.xUnit;
    let yLabel = currentSpectrum.yUnit;

    let flavor = '';
    if (xLabel.match(/\[.*C\]/)) flavor = 'weightVersusTemperature';
    if (xLabel.match(/\[.*s\]/)) flavor = 'weightVersusTime';
    if (flavor) {
      spectrum.add(currentSpectrum.data[0].x, oneSpectrum.data[0].y, flavor, {
        xLabel,
        yLabel,
        title: currentSpectrum.title,
      });
    }
  }
}
