<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Add a widget to the WordPress dashboard.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use Progress_Planner\Admin\Dashboard_Widget;

/**
 * Class Dashboard_Widget_Todo
 */
class Dashboard_Widget_Todo extends Dashboard_Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'todo';

	/**
	 * Get the title of the widget.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'To-do list Progress Planner', 'progress-planner' );
	}

	/**
	 * Render the dashboard widget.
	 *
	 * @return void
	 */
	public function render_widget() {
		\progress_planner()->get_admin__page()->enqueue_styles();
		\progress_planner()->get_admin__scripts()->register_scripts();

		$todo_widget = \progress_planner()->get_admin__page()->get_widget( 'todo' );
		if ( $todo_widget ) {
			$todo_widget->enqueue_styles();
			$todo_widget->enqueue_scripts();
		}

		\progress_planner()->the_view( "dashboard-widgets/{$this->id}.php" );
	}
}
// phpcs:enable Generic.Commenting.Todo
