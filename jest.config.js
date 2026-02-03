const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,
	roots: [ '<rootDir>/assets/src' ],
	setupFilesAfterEnv: [
		'<rootDir>/assets/src/__tests__/setup.js',
	],
	testMatch: [
		'**/__tests__/**/*.test.[jt]s?(x)',
	],
	testPathIgnorePatterns: [ '/node_modules/', '<rootDir>/tests/' ],
	collectCoverageFrom: [
		'assets/src/**/*.{js,jsx}',
		'!assets/src/**/__tests__/**',
	],
};
