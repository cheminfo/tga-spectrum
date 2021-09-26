# Changelog

## [0.17.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.16.0...v0.17.0) (2021-09-14)


### Features

* auto select utf16 for ta instruments ([eff05ef](https://www.github.com/cheminfo/tga-spectrum/commit/eff05ef70dab9aed745c8cf1b4ca01770077fe19))


### Bug Fixes

* from TAInstruments to deal with mof.txt ([33af3a5](https://www.github.com/cheminfo/tga-spectrum/commit/33af3a584bca6335ee248c31fd8eacd806b204e6))

## [0.16.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.15.1...v0.16.0) (2021-05-07)


### Features

* fromTAInstrument will convert ArrayBuffer to text ([080d9d8](https://www.github.com/cheminfo/tga-spectrum/commit/080d9d8a9f53d180407d0da390aa2f29de9d5c04))

### [0.15.1](https://www.github.com/cheminfo/tga-spectrum/compare/v0.15.0...v0.15.1) (2021-05-06)


### Bug Fixes

* use named imports from xlsx ([1081b83](https://www.github.com/cheminfo/tga-spectrum/commit/1081b834bd8d6b3f525db295c0895e2683f91a03))

## [0.15.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.14.1...v0.15.0) (2021-05-06)


### ⚠ BREAKING CHANGES

* Break compatibility with node 10 and 12

### Features

* add fromNetzsch ([89a40cd](https://www.github.com/cheminfo/tga-spectrum/commit/89a40cda2c527086187ac74eea7bf0460c72d50f))
* adding cheminfo metadata ([8444025](https://www.github.com/cheminfo/tga-spectrum/commit/8444025838b745283bb91a47f48748d38b183457))
* Break compatibility with node 10 and 12 ([0a40609](https://www.github.com/cheminfo/tga-spectrum/commit/0a406098ed1b9bb2178b085271c8f1d010f0374b))


### Bug Fixes

* mass in Netzsch parser ([#35](https://www.github.com/cheminfo/tga-spectrum/issues/35)) ([957fd00](https://www.github.com/cheminfo/tga-spectrum/commit/957fd0020b5356157d9acd169c830bc3e11f6d74))
* typo in package.json metadata ([99df58d](https://www.github.com/cheminfo/tga-spectrum/commit/99df58d48cca5a135c42a4a1c59b73990b0e36d4))

### [0.14.1](https://www.github.com/cheminfo/tga-spectrum/compare/v0.14.0...v0.14.1) (2021-03-02)


### Bug Fixes

* ta parser bug ([5d295ca](https://www.github.com/cheminfo/tga-spectrum/commit/5d295ca2fc7b2b1fb7f40b8c7c217cd68b281b5a))

## [0.14.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.13.0...v0.14.0) (2021-03-01)


### Features

* udate dependencies for baseline correction ([ca8a845](https://www.github.com/cheminfo/tga-spectrum/commit/ca8a845f1289b1be110da79188d347bff8332795))


### Bug Fixes

* ta parser did not work on all ta txt files due to StartOfData line ([323a090](https://www.github.com/cheminfo/tga-spectrum/commit/323a090ddef464b0f6e305ffbf2076bd7ff50598))

## [0.13.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.12.1...v0.13.0) (2021-02-09)


### Features

* added excel parser, [#9](https://www.github.com/cheminfo/tga-spectrum/issues/9) ([3f06bad](https://www.github.com/cheminfo/tga-spectrum/commit/3f06bad27d7fd6e6799d23bdc21bf51d7cc02ad5))
* update dependencies and add JSGraph export object ([e741d25](https://www.github.com/cheminfo/tga-spectrum/commit/e741d25196f07946fde180f9aa5656533d1097cc))


### Bug Fixes

* fix time units, [#10](https://www.github.com/cheminfo/tga-spectrum/issues/10) ([#12](https://www.github.com/cheminfo/tga-spectrum/issues/12)) ([e06dff3](https://www.github.com/cheminfo/tga-spectrum/commit/e06dff371e90dec314c188c11bc0eff99cb93382))
