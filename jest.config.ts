// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  globals: {
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    "ts-jest": {
      "tsconfig": "./tsconfig.json",
      "isolatedModules": true,
      "diagnostics": true
    }
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  testEnvironment: 'jsdom',
  testResultsProcessor: "jest-sonar-reporter",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.(tsx|ts|jsx|js)"
  ],
  rootDir: "src/",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleDirectories: ["node_modules", "bower_components", "src"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "electron$": "<rootDir>/test/electron.ts"
  }

};

export default config;