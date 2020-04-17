import getNormalized from './util/getNormalized';
import sortX from 'ml-array-xy-sort-x';

const DEFAULT_FLAVOR = 'weightVersusTemperature';

/**
 * Class allowing to store and manipulate a spectrum
 * @class Spectrum
 * @param {object} [data={}] - object containing a spectrum
 * @param {Array} [data.x=[]] - voltage
 * @param {Array} [data.y=[]] - intensity
 * @param {object} [options={}]
 */
export default class Spectrum {
  constructor(options = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 10);
    this.flavors = {};
  }

  set(points, options = {}) {
    const { flavor = DEFAULT_FLAVOR } = options;
    this.flavors[flavor.toLowerCase()] = standardizeData(points, options);
  }

  get(flavor = DEFAULT_FLAVOR) {
    flavor = flavor.toLowerCase();
    if (!this.flavors[flavor]) {
      return undefined;
    }
    return this.flavors[flavor];
  }

  getData(options = {}) {
    const { flavor, normalization } = options;
    let data = this.get(flavor);
    if (!data) return undefined;
    return getNormalized(data, normalization);
  }

  getXLabel(flavor) {
    return this.get(flavor).xAxis;
  }

  getYLabel(flavor) {
    return this.get(flavor).yAxis;
  }
}

function standardizeData(points, options = {}) {
  const { meta = {}, tmp = {}, xLabel = '', yLabel = '', title = '' } = options;
  if (false) {
    points = sortX(points);
  } else {
    let { x, y } = points;
    if (x && x.length > 1 && x[0] > x[x.length - 1]) {
      x = x.reverse();
      y = y.reverse();
    } else {
      x = x || [];
      y = y || [];
    }
    points = { x, y };
  }

  return {
    x: points.x,
    y: points.y,
    xLabel,
    yLabel,
    title,
    meta,
    tmp,
  };
}
