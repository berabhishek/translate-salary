export default {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@libsql/client$': '<rootDir>/src/lib/__mocks__/client.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
