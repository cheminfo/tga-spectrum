# tga-spectrum

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse TGA files from

- Perkin Elmer `txt` and `csv` files
- TA instruments `txt` and `xls` files
- Perkin Elmer
- Netzsch
- Mettler Toledo

## Installation

`$ npm i tga-spectrum`

## Usage

```js
import TGASpectrum from 'tga-spectrum';

let analysis = TGASpectrum.fromJcamp(jcamp);
```

## [API Documentation](https://cheminfo.github.io/tga-spectrum/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/tga-spectrum.svg
[npm-url]: https://www.npmjs.com/package/tga-spectrum
[ci-image]: https://github.com/cheminfo/tga-spectrum/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/tga-spectrum/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/tga-spectrum.svg
[codecov-url]: https://codecov.io/gh/cheminfo/tga-spectrum
[download-image]: https://img.shields.io/npm/dm/tga-spectrum.svg
[download-url]: https://www.npmjs.com/package/tga-spectrum
