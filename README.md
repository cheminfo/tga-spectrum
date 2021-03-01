# tga-spectrum

[![NPM version][npm-image]][npm-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse TGA files from

- Perkin Elmer `txt` and `csv` files
- TA instruments `txt` and `xls` files


## Installation

`$ npm install --save tga-spectrum`

## Usage

```js
import TGASpectrum from 'tga-spectrum';

let analysis = TGASpectrum.fromJcamp(jcamp);
```

## [API Documentation](https://cheminfo.github.io/tga-spectrum/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/tga-spectrum.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/tga-spectrum
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/tga-spectrum.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/cheminfo/tga-spectrum
[download-image]: https://img.shields.io/npm/dm/tga-spectrum.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/tga-spectrum
