import { convert } from 'jcampconverter';

export default function addJcamp(spectrum, jcamp) {
  let converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
    canonicDataLabels: false,
    dynamicTyping: true,
  });

  for (let entry of converted.flatten) {
    let currentSpectrum = entry.spectra[0];

    let xLabel = currentSpectrum.xUnit;
    let yLabel = currentSpectrum.yUnit;

    let flavor = '';
    if (xLabel.match(/\[.*C\]/)) flavor = 'weightVersusTemperature';
    if (xLabel.match(/\[.*s\]/)) flavor = 'weightVersusTime';
    if (flavor) {
      spectrum.set(currentSpectrum.data, {
        flavor,
        xLabel,
        yLabel,
        title: currentSpectrum.title,
      });
    }
  }
}
