<?php
/**
 * Class to add the AIOSEO providers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add tasks for All in One SEO configuration.
 *
 * Note: AIOSEO task providers have been migrated to React.
 * This class now only handles:
 * - Interactive task allowed options
 */
class Add_AIOSEO_Providers {

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( \function_exists( 'aioseo' ) ) {
			\add_filter( 'progress_planner_interactive_task_allowed_options', [ $this, 'add_interactive_task_allowed_options' ] );
		}
	}

	/**
	 * Add the interactive task allowed options.
	 *
	 * @param array $allowed_options The allowed options.
	 * @return array
	 */
	public function add_interactive_task_allowed_options( $allowed_options ) {
		$allowed_options[] = 'aioseo_options';
		$allowed_options[] = 'aioseo_options_dynamic';
		return $allowed_options;
	}
}
