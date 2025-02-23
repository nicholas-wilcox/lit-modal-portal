# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.7.1] - 2025-02-16

### Fixed
- Fix typo in typedoc
- Typos in README

### Changed
- Updated dev dependencies

## [0.7.0] - 2024-04-17

### Fixed
- Added `TargetOrSelector` type alias to typedoc.

### Changed
- Improved how portals can be cleaned up during tests.
- The disconnected method on the `portal` directive now checks that the portal container is in the target's children.
  If not, then a warning will be printed that the container was already removed from the target.

  The prevalence of this issue is unknown, but it was encountered while working with components
  in portals rendered using `open-wc`'s `fixture` helper.
- Refactor lambdas out of tests to support setting the Mocha timeout limit.
- Refactor the `portal` directive's `value` argument to be named `content`.

### Added
- Tests for Lit lifecycle methods called on components that are in portals.
- Support for asynchronous portal content, with tests and demo code.
  - Portals with asynchronous content can render a placeholder while the content resolves.

## [0.6.2] - 2024-04-09

### Changed
- Refactored type of portal target to be `Node` instead of `HTMLElement`.

## [0.6.1] - 2024-04-07

### Changed
- Removed the "(currently unreleased)" text from the README notice about version 0.6

## [0.6.0] - 2024-04-07

Major refactor.

### Added
- Some tests! Can you even believe that?

### Changed
- Almost everything, but especially the `portal` directive

### Removed
- Almost everything else, notably the `modalController` and the `<modal-portal>` component.

## [0.5.0-pre] - 2024-03-27
Thanks to [klasjersevi](https://github.com/klasjersevi)

### Changed
- Updated dependencies.
- Explicitly set tsconfig in esbuild usage.

### Fixed
- Set Lit to be a peer dependency.

## [0.4.1] - 2022-06-16
### Fixed
- Example code in README.md

## [0.4.0] - 2022-06-16
### Added
- Demo video in README.md

### Removed
- Minified build

## [0.3.1] - 2022-06-13
### Changed
- Refactored the modules and exports again to permit usage of the minified build.

### Added
- All the things that should be in a README.

## [0.3.0] - 2022-06-13
### Changed
- Reconfigured `index` and `lib` modules to actually work for both docs and exports.

## [0.2.1] - 2022-06-10
### Changed
- Set immutable-js to be a regular dependency.

### Fixed
- The links in the changelog, lol.

## [0.2.0] - 2022-06-10
First release tag.

[Unreleased]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.7.1...HEAD
[0.7.1]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.6.2...v0.7.0
[0.6.2]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.5.0-pre...v0.6.0
[0.5.0-pre]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.4.1...v0.5.0-pre
[0.4.1]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/nicholas-wilcox/lit-modal-portal/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/nicholas-wilcox/lit-modal-portal/releases/tag/v0.2.0
