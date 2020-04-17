import equallySpaced from 'ml-array-xy-equally-spaced';
import Stat from 'ml-stat/array';
import normed from 'ml-array-normed';
import rescale from 'ml-array-rescale';
import filterX from 'ml-array-xy-filter-x';

/**
 *
 * @private
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.from=spectrum.x[0]]
 * @param {number} [options.to=spectrum.x[spectrum.x.length-1]]
 * @param {number} [options.numberOfPoints]
 * @param {Array} [options.filters=[]]
 * @param {Array} [options.exclusions=[]]
 */
export default function getNormalized(spectrum, options = {}) {
  let {
    from = spectrum.x[0],
    to = spectrum.x[spectrum.x.length - 1],
    numberOfPoints,
    filters = [],
    exclusions = [],
  } = options;

  let y = spectrum.y.slice(0);
  console.log({ filters });
  for (let filter of filters) {
    switch (filter.name) {
      case 'centerMean': {
        let mean = Stat.mean(spectrum.y);
        let meanFct = (y) => y - mean;
        y = y.map(meanFct);
        break;
      }
      case 'scaleSD': {
        let std = Stat.standardDeviation(spectrum.y);
        let stdFct = (y) => y / std;
        y = y.map(stdFct);
        break;
      }
      case 'normalize': {
        y = normed(y);
        break;
      }
      case 'rescale': {
        y = rescale(y);
        break;
      }
      case '':
      case undefined:
        break;
      default:
        throw new Error(`Unknown process kind: ${process.kind}`);
    }
  }
  console.log({ from, to, spectrum, numberOfPoints });
  if (!numberOfPoints) {
    return filterX({ x: spectrum.x, y }, { from, to, exclusions });
  }

  return equallySpaced(
    { x: spectrum.x, y },
    { from, to, numberOfPoints, exclusions },
  );
}
