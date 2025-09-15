<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * Suggested_Tasks class.
 */
final class Suggested_Tasks extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'suggested-tasks';

	/**
	 * The widget width.
	 *
	 * @var int
	 */
	protected $width = 2;

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		// Register styles for the web-component.
		\wp_register_style(
			'progress-planner-suggested-task',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/suggested-task.css',
			[],
			\progress_planner()->get_file_version( \constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/suggested-task.css' )
		);

		return [
			'progress-planner-suggested-task',
		];
	}
}
