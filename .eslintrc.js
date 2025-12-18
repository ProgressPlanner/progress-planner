module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:eslint-comments/recommended',
	],
	parserOptions: {
		ecmaVersion: 'latest',
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		'no-console': 'off',
	},
	overrides: [
		{
			files: [
				'**/__tests__/**/*.js',
				'**/tests/**/*.js',
				'assets/src/__tests__/*.js',
			],
			env: {
				jest: true,
			},
		},
	],
};
