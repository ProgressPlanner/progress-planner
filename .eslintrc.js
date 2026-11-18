module.exports = {
	root: true,
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:eslint-comments/recommended',
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'no-console': 'off',
	},
};
