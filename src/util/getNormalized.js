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

  let { x, y } = filterX(spectrum, { from, to });

  console.log({ from, to, x, y });

  console.log({ filters });
  for (let filter of filters) {
    let options = filter.options || {};
    switch (filter.name) {
      case 'centerMean': {
        let mean = Stat.mean(y);
        let meanFct = (y) => y - mean;
        y = y.map(meanFct);
        break;
      }
      case 'scaleSD': {
        let std = Stat.standardDeviation(y);
        let stdFct = (y) => y / std;
        y = y.map(stdFct);
        break;
      }
      case 'normalize': {
        // should be an integration in fact
        y = normed(y, {
          sumValue: options.value ? Number(options.value) : 1,
          algorithm: 'absolute',
        });
        break;
      }
      case 'rescale': {
        y = rescale(y, {
          min: options.min ? Number(filter.options.min) : 0,
          max: options.max ? Number(filter.options.max) : 1,
        });
        break;
      }
      case '':
      case undefined:
        break;
      default:
        throw new Error(`Unknown process kind: ${process.kind}`);
    }
  }

  if (!numberOfPoints) {
    return filterX({ x, y }, { from, to, exclusions });
  }

  return equallySpaced({ x, y }, { from, to, numberOfPoints, exclusions });
}
