const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		'content-activity': './assets/src/content-activity.js',
		'monthly-badges': './assets/src/monthly-badges.js',
		'content-badges': './assets/src/content-badges.js',
		'streak-badges': './assets/src/streak-badges.js',
		'activity-scores': './assets/src/activity-scores.js',
	},
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: '[name].js',
	},
};
