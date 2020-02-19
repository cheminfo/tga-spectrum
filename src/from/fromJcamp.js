import { createTree } from 'jcampconverter';

import addJcamp from '../addJcamp';
import { Spectrum } from '../Spectrum';
/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @return {Spectrum} - New class element with the given data
 */
export function fromJcamp(jcamp) {
  let tree = createTree(jcamp);
  let spectrum = new Spectrum();
  for (let item of tree) {
    addJcamp(spectrum, item.jcamp);
  }

  return spectrum;
}
