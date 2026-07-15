module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
    '^.+\\.vue$': ['@vue/vue3-jest', {
      compilerOptions: {
        mode: 'module',
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^#q-app$': '<rootDir>/test/__mocks__/q-app.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  setupFiles: ['./test/setup.ts'],
};
