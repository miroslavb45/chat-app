module.exports = {
 
  preset:"../../../jest.preset.js",
  coverageDirectory: '../../../coverage/libs/shared-config',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json'
    }
  },"displayName": "shared-config"
};
