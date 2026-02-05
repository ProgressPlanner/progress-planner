const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		dashboard: './assets/src/dashboard.js',
		editor: './assets/src/editor/index.js',
		'widget-suggested-tasks':
			'./assets/src/widgets/SuggestedTasks/index.js',
		'widget-todo': './assets/src/widgets/TodoWidget/index.js',
		'widget-monthly-badges': './assets/src/widgets/MonthlyBadges/index.js',
		'widget-streak-badges': './assets/src/widgets/StreakBadges/index.js',
		'widget-content-badges': './assets/src/widgets/ContentBadges/index.js',
		'widget-activity-scores':
			'./assets/src/widgets/ActivityScores/index.js',
		'widget-content-activity':
			'./assets/src/widgets/ContentActivity/index.js',
		'widget-whats-new': './assets/src/widgets/WhatsNew/index.js',
		'plugin-deactivation': './assets/src/plugin-deactivation/index.js',
	},
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: '[name].js',
		chunkFilename: '[name].chunk.js', // Dynamic chunks for React.lazy()
		publicPath: 'auto', // Auto-detect URL path for dynamic imports
	},
	optimization: {
		...defaultConfig.optimization,
		// Share runtime across dashboard entry points to ensure modules
		// (like Zustand store) are instantiated only once.
		// Exclude plugin-deactivation since it runs on a different page.
		runtimeChunk: {
			name: ( entrypoint ) =>
				entrypoint.name === 'plugin-deactivation' ? false : 'runtime',
		},
	},
};
