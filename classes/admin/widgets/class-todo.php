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

		// Get widget title (may be custom branded or default).
		$widget_title = \progress_planner()->get_ui__branding()->get_widget_title(
			'todo',
			\esc_html__( 'My to-do list', 'progress-planner' )
		);

		// Get widget descriptions.
		$golden_task_description = \esc_html__( 'Write down all your tasks you want to get done on your website! You\'ll earn points for your \'golden task\'. ', 'progress-planner' );
		$silver_task_description = \esc_html__( 'Write down all your tasks you want to get done on your website! The top task will become your \'golden task\' next week. ', 'progress-planner' );

		// Get info icon SVG content.
		$info_icon_svg = \progress_planner()->get_asset( 'images/icon_info.svg' );

		// Get tooltip content.
		$tooltip_content = \esc_html__( 'Every Monday, your top task becomes the golden task for the week. Complete it anytime this week to earn points toward your monthly total! Once done, the next task is highlighted to become your golden task next week.', 'progress-planner' );

		\wp_localize_script(
			'progress-planner/todo',
			'prplTodoConfig',
			[
				'nonce'                  => \wp_create_nonce( 'wp_rest' ),
				'userProviderId'         => $user_provider_id,
				'title'                  => $widget_title,
				'goldenTaskDescription'  => $golden_task_description,
				'silverTaskDescription'  => $silver_task_description,
				'infoIconSvg'            => $info_icon_svg,
				'tooltipContent'         => $tooltip_content,
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
