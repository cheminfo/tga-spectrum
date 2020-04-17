export default class Spectra {
  constructor() {
    this.data = [];
  }

  addSpectrum(spectrum) {
    let index = this.getSpectrumIndex(spectrum.id);
    if (index === undefined) {
      this.data.push(spectrum);
    } else {
      this.data[index] = spectrum;
    }
  }

  /**
   * Remove the spectrum from the SpectraProcessor for the specified id
   * @param {string} id
   */
  removeSpectrum(id) {
    let index = this.getSpectrumIndex(id);
    if (index === undefined) return undefined;
    return this.data.splice(index, 1);
  }

  /**
   * Returns the index of the spectrum in the spectra array
   * @param {string} id
   * @returns {number}
   */
  getSpectrumIndex(id) {
    if (!id) return undefined;
    for (let i = 0; i < this.data.length; i++) {
      let spectrum = this.data[i];
      if (spectrum.id === id) return i;
    }
    return undefined;
  }

  /**
   * Checks if the ID of a spectrum exists in the SpectraProcessor
   * @param {string} id
   */
  contains(id) {
    return !isNaN(this.getSpectrumIndex(id));
  }
}
