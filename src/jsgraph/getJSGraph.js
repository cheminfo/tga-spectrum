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
  let chart = {
    data: [],
  };

  for (let i = 0; i < data.length; i++) {
    const spectrum = data[i];
    if (!ids || ids.includes(spectrum.id)) {
      let currentData = spectrum.getData({ flavor, normalization });
      console.log({ currentData });
      if (!currentData) continue;
      addStyle(currentData, spectrum, { color: colors[i] });
      chart.data.push(currentData);
    }
  }
  return chart;
}
