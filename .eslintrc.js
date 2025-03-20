module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:@wordpress/eslint-plugin/esnext',
		'plugin:@wordpress/eslint-plugin/jsdoc',
		'plugin:eslint-comments/recommended',
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		"no-console": "off",
	},
};
