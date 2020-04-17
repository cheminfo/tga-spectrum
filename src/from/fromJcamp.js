import Spectrum from '../Spectrum';
import addJcamp from '../addJcamp';
/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @return {Spectrum} - New class element with the given data
 */
export default function fromJcamp(jcamp, options = {}) {
  let spectrum = new Spectrum(options);
  addJcamp(spectrum, jcamp);
  return spectrum;
}
