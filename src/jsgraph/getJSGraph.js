import addStyle from './addStyle';

/**
 * Retrieve a chart with selected original data
 * @param {object} [options={}]
 * @param {Array} [options.ids] List of spectra ids, by default all
 * @param {Array} [options.colors] List of colors
 * @param {Array} [options.flavor]
 * @param {object} [options.normalization]
 */
export default function getJSGraph(spectra, options = {}) {
  let data = spectra.data || spectra;
  const { ids, colors, flavor, normalization } = options;
  let series = [];

  let xLabel = '';
  let yLabel = '';

  for (let i = 0; i < data.length; i++) {
    const spectrum = data[i];
    if (!ids || ids.includes(spectrum.id)) {
      let serie = {};
      let currentData = spectrum.getData({ flavor, normalization });
      if (!currentData) continue;
      if (!xLabel) xLabel = spectrum.getXLabel(flavor);
      if (!yLabel) yLabel = spectrum.getYLabel(flavor);
      addStyle(serie, spectrum, { color: colors[i] });
      serie.data = currentData;
      series.push(serie);
    }
  }
  return {
    axes: {
      x: {
        label: xLabel,
        unit: '',
        unitWrapperBefore: '',
        unitWrapperAfter: '',
        flipped: false,
        display: true,
      },
      y: {
        label: yLabel,
        unit: '',
        unitWrapperBefore: '',
        unitWrapperAfter: '',
        flipped: false,
        display: true,
      },
    },
    series,
  };
}
