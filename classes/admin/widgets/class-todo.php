<?php // phpcs:disable Generic.Commenting.Todo
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * ToDo class.
 */
final class ToDo extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'todo';

	/**
	 * The widget width.
	 *
	 * @var int
	 */
	protected $width = 2;

	/**
	 * Enqueue scripts for the widget.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$asset_file = \PROGRESS_PLANNER_DIR . '/build/todo.asset.php';
		if ( ! \file_exists( $asset_file ) ) {
			return;
		}
		$asset = include $asset_file;

		\wp_enqueue_script(
			'progress-planner/todo',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/build/todo.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Get the user provider term ID.
		$user_provider_term = \get_term_by( 'slug', 'user', 'prpl_recommendations_provider' );
		$user_provider_id   = $user_provider_term ? $user_provider_term->term_id : 0;

		\wp_localize_script(
			'progress-planner/todo',
			'prplTodoConfig',
			[
				'nonce'          => \wp_create_nonce( 'wp_rest' ),
				'userProviderId' => $user_provider_id,
			]
		);

		// Enqueue celebrate.js for confetti effects.
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'celebrate' );
	}

	/**
	 * Print the widget content.
	 *
	 * @return void
	 */
	public function print_content() {
		// The React component renders all content.
		echo '<div id="prpl-todo-root"></div>';
	}

	/**
	 * The TODO list.
	 *
	 * @deprecated 2.0.0 Now handled by React component.
	 *
	 * @return void
	 */
	public function the_todo_list() {
		// Legacy method - now handled by React.
		echo '<div id="prpl-todo-root"></div>';
	}

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
// phpcs:enable Generic.Commenting.Todo
