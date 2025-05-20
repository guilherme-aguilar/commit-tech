module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "testEnvironment": "node",
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/$1"
  },
  "passWithNoTests": true,
  "coverageProvider": "v8",
  "collectCoverage": true,
  "coverageReporters": ["text", "lcov"],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    ".*\\.spec\\.ts$"
  ],
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage"
}