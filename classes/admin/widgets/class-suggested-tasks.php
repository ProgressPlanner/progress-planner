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
	 * Get widget configuration.
	 *
	 * @return array Widget configuration.
	 */
	public function get_widget_config() {
		// Get widget title (may be custom branded or default).
		$widget_title = \progress_planner()->get_ui__branding()->get_widget_title(
			'suggested-tasks',
			\sprintf(
				/* translators: %s: Ravi's name. */
				\esc_html__( '%s\'s Recommendations', 'progress-planner' ),
				\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
			)
		);

		// Get widget description.
		$widget_description = \sprintf(
			/* translators: %s: Ravi's name. */
			\esc_html__( 'Complete a task from %s\'s Recommendations to improve your site and earn points toward this month\'s badge!', 'progress-planner' ),
			\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
		);

		return [
			'perPage'          => self::PER_PAGE_DEFAULT,
			'raviName'         => \progress_planner()->get_ui__branding()->get_ravi_name(),
			'nonce'            => \wp_create_nonce( 'progress_planner' ),
			'ajaxUrl'          => \admin_url( 'admin-ajax.php' ),
			'delayCelebration' => ! \progress_planner()->is_on_progress_planner_dashboard_page(),
			'title'            => $widget_title,
			'description'      => $widget_description,
		];
	}
}
