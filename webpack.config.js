const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		'content-activity': './assets/src/content-activity.js',
		'monthly-badges': './assets/src/monthly-badges.js',
	},
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: '[name].js',
	},
};
