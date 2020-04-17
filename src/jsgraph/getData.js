/**
 *
 * @param {*} spectrum
 * @param {object} [options={}]
 *
 */

export default function getData(spectrum, options = {}) {
  const { mode = options.mode || spectrum.mode, filter } = options;

  let data = { x: [], y: [] };
  switch (mode) {
    case ABSORBANCE:
      data = spectrum.getAbsorbance();
      break;
    case TRANSMITTANCE:
      data = spectrum.getTransmittance();
      break;
    case PERCENT_TRANSMITTANCE:
      data = spectrum.getPercentTransmittance();
      break;
    default:
  }
  if (filter) {
    data = filterX(data, filter);
  }
  return data;
}
