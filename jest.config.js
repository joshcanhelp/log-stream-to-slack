module.exports = {
  "testEnvironment": "node",
  "collectCoverageFrom": [
    "**/src/**/*.{ts,tsx,js,jsx}",
    "**/test/**/*.{ts,tsx,js,jsx}"
  ],
  "coverageDirectory": "./coverage",
  "coveragePathIgnorePatterns": [
    "coverage/",
    "node_modules/",
    "public/",
    "esm/",
    "lib/",
    "tmp/",
    "dist/"
  ],
  "coverageReporters": [
    "lcov",
    "json-summary",
    "html"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 75,
      "functions": 75,
      "lines": 75,
      "statements": 75
    }
  },
  "resetMocks": true
};