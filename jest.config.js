module.exports = {
    moduleDirectories: [
      "node_modules",
      "packages/common",
      "packages/app/src"
    ],
    collectCoverageFrom: [
      "**/server/src/**"
    ],
    preset: 'ts-jest'
  }