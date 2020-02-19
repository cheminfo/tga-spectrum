# tga-spectrum

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

.

## Installation

`$ npm install --save tga-spectrum`

## Usage

```js
import TGASpectrum from 'tga-spectrum';

let spectrum = TGASpectrum.fromJcamp(jcamp);

let data = spectrum.get(); // default to 'weightversustemperature'

let data = spectrum.get('weightVersusTime');

```

## [API Documentation](https://cheminfo.github.io/tga-spectrum/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/tga-spectrum.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/tga-spectrum
[travis-image]: https://img.shields.io/travis/cheminfo/tga-spectrum/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo/tga-spectrum
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/tga-spectrum.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/cheminfo/tga-spectrum
[download-image]: https://img.shields.io/npm/dm/tga-spectrum.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/tga-spectrum
