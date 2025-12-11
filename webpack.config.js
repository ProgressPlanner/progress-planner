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
		'whats-new': './assets/src/whats-new.js',
		'suggested-tasks': './assets/src/suggested-tasks.js',
		todo: './assets/src/todo.js',
		'dashboard-header': './assets/src/dashboard-header.js',
	},
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: '[name].js',
	},
};
