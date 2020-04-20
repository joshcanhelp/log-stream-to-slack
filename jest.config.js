// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A list of reporter names that Jest uses when writing coverage reports.
  coverageReporters: [
    'json', 'json-summary', 'text'
  ],

  // An array of glob patterns indicating a set of files for which coverage information should be collected.
  collectCoverageFrom: [
    'api/**/*',
    'lib/**/*'
  ],

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/?(*.)+(test).[jt]s?(x)'
  ],
};
