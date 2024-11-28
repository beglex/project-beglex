/** @type {import('jest').Config} */
export default {
    coverageDirectory: '../coverage',
    forceCoverageMatch: ['**/*.e2e.ts', '**/*.test.ts'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: {
        '^@root/(.*)$': '<rootDir>/../src/$1',
    },
    detectOpenHandles: true,
    preset: 'ts-jest',
    rootDir: 'test',
    testEnvironment: 'node',
    testRegex: ['.*\\.test\\.ts$', '.*\\.e2e\\.ts$'],
    testTimeout: 30000,
    transform: {
        '^.+\\.(t|j)s$': ['ts-jest', {tsconfig: './tsconfig.test.json'}],
    },
    verbose: true,
};
