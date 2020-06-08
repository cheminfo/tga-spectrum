import { CommonSpectrum } from 'common-spectrum';

export const {
  Analysis,
  AnalysesManager,
  fromJcamp,
  toJcamp,
  getJSGraph,
  getNormalizationAnnotations,
} = CommonSpectrum({
  dataType: 'TGA',
  defaultFlavor: 'weightVersusTemperature',
});

export { fromPerkinElmer } from './from/fromPerkinElmer';
export { fromPerkinElmerCSV } from './from/fromPerkinElmerCSV';
