const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,
	roots: [ '<rootDir>/assets/src' ],
	setupFilesAfterEnv: [ '<rootDir>/assets/src/__tests__/setup.js' ],
	moduleNameMapper: {
		...( defaultConfig.moduleNameMapper || {} ),
		'@wordpress/html-entities':
			'<rootDir>/assets/src/__tests__/mocks/html-entities.js',
		'(.*)/services/apiFetchCache':
			'<rootDir>/assets/src/__tests__/mocks/apiFetchCache.js',
	},
	testMatch: [ '**/__tests__/**/*.test.[jt]s?(x)' ],
	testPathIgnorePatterns: [ '/node_modules/', '<rootDir>/tests/' ],
	collectCoverageFrom: [
		'assets/src/**/*.{js,jsx}',
		'!assets/src/**/__tests__/**',
	],
};
