# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased] - 2024-11-19

### Added
- Integrated Happydom for DOM-based testing  
  Introduced Happydom to enable DOM-like testing, improving test reliability and ensuring compatibility with DOM APIs in a controlled testing environment.

- Unit tests for element class checks and sibling comparisons  
  Enhanced test coverage for DOM element class validation and sibling order comparison logic.

- Unit tests for wrapper and element selection functions  
  Added new tests to verify the correct behavior of wrapper and element selection utilities.

- More tests for scroll and parent detection functions  
  Improved test coverage for scroll-related and parent detection functions to ensure proper behavior.

- Tests for scrollable element and parent detection functions  
  Created unit tests to specifically target the functionality of detecting scrollable elements and their parent containers.

- Unit tests for more utility functions  
  Included additional test cases for various utility functions, improving overall test reliability.

- Expanded tests for deep merge functionality  
  Enhanced the test suite for the `deepMerge` function to ensure its correctness.

### Changed
- Improved swipe scroll compatibility on mobile for multiple browsers  
  Resolved an issue where swipe scrolling was functional only in
  Firefox. Adjusted the implementation to support smooth scrolling
  behavior across additional browsers.

- Added tolerance to scroll detection to prevent rounding errors  
  Introduced a tolerance value to improve detection of scroll start
  and end, addressing rounding issues in certain browsers and ensuring
  consistent behavior across environments.

### Fixed
- Corrected position logic in `isElementBeforeOrAfter` function  
  Fixed the logic in the `isElementBeforeOrAfter` function to ensure accurate comparison of DOM elements based on their position.

- Improved depth handling in utility functions  
  Fixed issues with depth management, ensuring utility functions handle nested structures properly.

- Validated parent before adding standalone slides  
  Ensured that standalone slides are validated for their parent elements before being added to the slider, preventing errors and redundancy.

- Corrected regex logic in `extractClassName` function  
  Fixed a bug in the regular expression for extracting class names, ensuring proper functionality across different cases.

- Corrected deep merge logic  
  Fixed issues in the `deepMerge` function, ensuring deep merging of objects is performed accurately.

## [0.1.0-alpha] - 2024-11-18

### Added
- **Smooth Scrolling:** Navigate between sections with fluid transitions for an enhanced user experience.
- **Customizable Options:** Configure scroll speed, easing functions, and navigation controls effortlessly.
- **Swipe Support:** Users can click and drag to navigate between sections on PCs and swipe on touch devices.
- **Zero Dependencies:** No external libraries required for basic usage.
