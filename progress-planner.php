<?php
/**
 * A plugin to help you fight procrastination and get things done.
 *
 * @package Progress_Planner
 *
 * Plugin name:       Progress Planner
 * Plugin URI:        https://prpl.fyi/home
 * Description:       A plugin to help you fight procrastination and get things done.
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Version:           1.2.0
 * Author:            Team Emilia Projects
 * Author URI:        https://prpl.fyi/about
 * License:           GPL-3.0+
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       progress-planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PROGRESS_PLANNER_FILE', __FILE__ );
define( 'PROGRESS_PLANNER_DIR', __DIR__ );
define( 'PROGRESS_PLANNER_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );

/**
 * Autoload classes.
 */
spl_autoload_register(
	function ( $class_name ) {
		$prefix = 'Progress_Planner\\';

		if ( 0 !== \strpos( $class_name, $prefix ) ) {
			return;
		}

		// Deprecated classes.
		$deprecated = [
			'Progress_Planner\Activity'                   => [ 'Progress_Planner\Activities\Activity', '1.1.1' ],
			'Progress_Planner\Query'                      => [ 'Progress_Planner\Activities\Query', '1.1.1' ],
			'Progress_Planner\Date'                       => [ 'Progress_Planner\Utils\Date', '1.1.1' ],
			'Progress_Planner\Cache'                      => [ 'Progress_Planner\Utils\Cache', '1.1.1' ],
			'Progress_Planner\Widgets\Activity_Scores'    => [ 'Progress_Planner\Admin\Widgets\Activity_Scores', '1.1.1' ],
			'Progress_Planner\Widgets\Badge_Streak'       => [ 'Progress_Planner\Admin\Widgets\Badge_Streak', '1.1.1' ],
			'Progress_Planner\Widgets\Challenge'          => [ 'Progress_Planner\Admin\Widgets\Challenge', '1.1.1' ],
			'Progress_Planner\Widgets\Latest_Badge'       => [ 'Progress_Planner\Admin\Widgets\Latest_Badge', '1.1.1' ],
			'Progress_Planner\Widgets\Published_Content'  => [ 'Progress_Planner\Admin\Widgets\Published_Content', '1.1.1' ],
			'Progress_Planner\Widgets\Todo'               => [ 'Progress_Planner\Admin\Widgets\Todo', '1.1.1' ],
			'Progress_Planner\Widgets\Whats_New'          => [ 'Progress_Planner\Admin\Widgets\Whats_New', '1.1.1' ],
			'Progress_Planner\Widgets\Widget'             => [ 'Progress_Planner\Admin\Widgets\Widget', '1.1.1' ],
			'Progress_Planner\Rest_API_Stats'             => [ 'Progress_Planner\Rest\Stats', '1.1.1' ],
			'Progress_Planner\Rest_API_Tasks'             => [ 'Progress_Planner\Rest\Tasks', '1.1.1' ],
			'Progress_Planner\Data_Collector\Base_Data_Collector' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector', '1.1.1' ],
			'Progress_Planner\Data_Collector\Data_Collector_Manager' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Data_Collector_Manager', '1.1.1' ],
			'Progress_Planner\Data_Collector\Hello_World' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World', '1.1.1' ],
			'Progress_Planner\Data_Collector\Inactive_Plugins' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Inactive_Plugins', '1.1.1' ],
			'Progress_Planner\Data_Collector\Last_Published_Post' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post', '1.1.1' ],
			'Progress_Planner\Data_Collector\Post_Author' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author', '1.1.1' ],
			'Progress_Planner\Data_Collector\Sample_Page' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page', '1.1.1' ],
			'Progress_Planner\Data_Collector\Uncategorized_Category' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category', '1.1.1' ],
			'Progress_Planner\Chart'                      => [ 'Progress_Planner\UI\Chart', '1.1.1' ],
			'Progress_Planner\Popover'                    => [ 'Progress_Planner\UI\Popover', '1.1.1' ],
			'Progress_Planner\Debug_Tools'                => [ 'Progress_Planner\Utils\Debug_Tools', '1.1.1' ],
			'Progress_Planner\Onboard'                    => [ 'Progress_Planner\Utils\Onboard', '1.1.1' ],
			'Progress_Planner\Playground'                 => [ 'Progress_Planner\Utils\Playground', '1.1.1' ],
		];

		if ( isset( $deprecated[ $class_name ] ) ) {
			\trigger_error( // phpcs:ignore
				sprintf(
					'Class %1$s is <strong>deprecated</strong> since version %2$s! Use %3$s instead.',
					\esc_html( $class_name ),
					\esc_html( $deprecated[ $class_name ][1] ),
					\esc_html( $deprecated[ $class_name ][0] )
				),
				E_USER_DEPRECATED
			);
			class_alias( $deprecated[ $class_name ][0], $class_name );
		}

		$class_name = \str_replace( $prefix, '', $class_name );

		$parts = \explode( '\\', $class_name );
		$file  = PROGRESS_PLANNER_DIR . '/classes/';
		$last  = \array_pop( $parts );

		foreach ( $parts as $part ) {
			$file .= str_replace( '_', '-', strtolower( $part ) ) . '/';
		}
		$file .= 'class-' . \str_replace( '_', '-', \strtolower( $last ) ) . '.php';

		if ( \file_exists( $file ) ) {
			require_once $file;
		}
	}
);

/**
 * Get the progress planner instance.
 *
 * @return \Progress_Planner\Base
 */
function progress_planner() {
	global $progress_planner;
	if ( ! $progress_planner ) {
		$progress_planner = new \Progress_Planner\Base();
		$progress_planner->init();
	}
	return $progress_planner;
}

progress_planner();
