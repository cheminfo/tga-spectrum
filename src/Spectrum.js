import toJcamp from './to/toJcamp';
import addJcamp from './addJcamp';
/**
 * Class allowing manipulate a spectrum
 * @class spectrum
 * @param {object} [data={}] - object containing a spectrum
 * @param {Array} [data.x=[]] - voltage
 * @param {Array} [data.y=[]] - intensity
 */
export class Spectrum {
  constructor() {
    this.flavors = {};
  }

  add(x, y, flavor = 'weightVersusTemperature', options = {}) {
    if (!flavor) {
      throw new Error('You need to specify the flavor of analysis');
    }
    this.flavors[flavor.toLowerCase()] = normalizeData(x, y, options);
  }

  addJcamp(jcamp) {
    addJcamp(this.flavors, jcamp);
  }

  get(flavor = 'weightVersusTemperature') {
    if (!flavor) {
      throw new Error('You need to specify the flavor of analysis');
    }
    flavor = flavor.toLowerCase();
    if (!this.flavors[flavor]) {
      throw new Error(`No spectrum for the flavor: ${flavor}`);
    }
    return this.flavors[flavor];
  }

  getXLabel(flavor = 'weightVersusTemperature') {
    return this.get(flavor).meta;
  }

  getYLabel() {
    return 'Intensity [A]';
  }
}

Spectrum.prototype.getData = function() {
  return { x: this.x, y: this.y };
};

Spectrum.prototype.toJcamp = function() {
  return toJcamp(this);
};

function normalizeData(x, y, options = {}) {
  const { meta = {}, xLabel = 'abc', yLabel = 'def', title = '' } = options;
  if (x && x.length > 1 && x[0] > x[1]) {
    x = x.reverse();
    y = y.reverse();
  } else {
    x = x || [];
    y = y || [];
  }
  return {
    x,
    y,
    xLabel,
    yLabel,
    title,
    meta,
  };
}
