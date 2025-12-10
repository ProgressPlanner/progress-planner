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
	 * Default number of tasks to show per page.
	 *
	 * @var int
	 */
	public const PER_PAGE_DEFAULT = 5;

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

	/**
	 * Enqueue scripts for the widget.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$asset_file = \PROGRESS_PLANNER_DIR . '/build/suggested-tasks.asset.php';
		if ( ! \file_exists( $asset_file ) ) {
			return;
		}
		$asset = include $asset_file;

		\wp_enqueue_script(
			'progress-planner/suggested-tasks',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/build/suggested-tasks.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Check if the request URI contains the parameter 'prpl_show_all_recommendations'.
		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? \sanitize_text_field( \wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
		$show_all    = false !== \strpos( $request_uri, 'prpl_show_all_recommendations' );

		\wp_localize_script(
			'progress-planner/suggested-tasks',
			'prplSuggestedTasksConfig',
			[
				'perPage'          => self::PER_PAGE_DEFAULT,
				'raviName'         => \progress_planner()->get_ui__branding()->get_ravi_name(),
				'nonce'            => \wp_create_nonce( 'progress_planner' ),
				'showAll'          => $show_all,
				'ajaxUrl'          => \admin_url( 'admin-ajax.php' ),
				'delayCelebration' => ! \progress_planner()->is_on_progress_planner_dashboard_page(),
			]
		);

		// Enqueue celebrate.js for confetti effects (listens for prpl/celebrateTasks event).
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'celebrate' );
	}
}
