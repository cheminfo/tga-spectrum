import Spectra from '../Spectra';
import Spectrum from '../Spectrum';

describe('Spectra', () => {
  const spectra = new Spectra();
  it('check add / remove', () => {
    let spectrum = new Spectrum({ id: 'abc' });
    spectra.addSpectrum(spectrum);
    expect(spectra.data).toHaveLength(1);
    expect(spectra.getSpectrumIndex('abc')).toBe(0);
    spectra.addSpectrum(spectrum);
    expect(spectra.data).toHaveLength(1);
    let spectrum2 = new Spectrum({ id: 'def' });
    spectra.addSpectrum(spectrum2);
    expect(spectra.data).toHaveLength(2);
    expect(spectra.getSpectrumIndex('def')).toBe(1);
    spectra.removeSpectrum('abc');
    expect(spectra.data).toHaveLength(1);
    expect(spectra.getSpectrumIndex('def')).toBe(0);
  });
});
