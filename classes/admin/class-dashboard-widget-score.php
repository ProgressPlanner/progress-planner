<?php
/**
 * Add a widget to the WordPress dashboard.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use Progress_Planner\Admin\Dashboard_Widget;

/**
 * Class Dashboard_Widget_Score
 */
class Dashboard_Widget_Score extends Dashboard_Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'score';

	/**
	 * Get the title of the widget.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() );
	}

	/**
	 * Render the dashboard widget.
	 *
	 * @return void
	 */
	public function render_widget() {
		// Enqueue base stylesheets (variables + admin layout + branding overrides).
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/variables-color' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/admin' );
		\wp_add_inline_style( 'progress-planner/admin', \progress_planner()->get_ui__branding()->get_custom_css() );
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-gauge' );

		$suggested_tasks_widget = \progress_planner()->get_admin__page()->get_widget( 'suggested-tasks' );
		if ( $suggested_tasks_widget ) {
			$suggested_tasks_widget->enqueue_styles();
			$suggested_tasks_widget->enqueue_scripts();
		}

		\progress_planner()->get_admin__enqueue()->enqueue_style( "progress-planner/dashboard-widgets/{$this->id}" );

		\progress_planner()->get_admin__enqueue()->enqueue_script( 'external-link-accessibility-helper' );

		// Majoriry of the tasks are now interactive, we need a global object to handle the AJAX requests.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'recommendations/interactive-task',
			[
				'name' => 'progressPlanner',
				'data' => [
					'ajaxUrl' => \admin_url( 'admin-ajax.php' ),
					'nonce'   => \wp_create_nonce( 'progress_planner' ),
				],
			]
		);

		\progress_planner()->the_view( "dashboard-widgets/{$this->id}.php" );
	}

	/**
	 * Get the badge.
	 *
	 * @param string $category The category of the badge.
	 *
	 * @return array
	 */
	public function get_badge_details( $category = 'content' ) {
		static $cached = [
			'content'     => false,
			'maintenance' => false,
		];

		if ( $cached[ $category ] ) {
			return $cached[ $category ];
		}

		// Get the badge to display.
		foreach ( \progress_planner()->get_badges()->get_badges( $category ) as $badge ) {
			$progress = $badge->get_progress();
			if ( 100 > $progress['progress'] ) {
				break;
			}
		}

		if ( ! isset( $badge ) || ! isset( $progress ) ) {
			return [];
		}

		$result = [
			'progress'   => $progress,
			'badge'      => $badge,
			'color'      => 'var(--prpl-graph-color-1)',
			'background' => $badge->get_background(),
		];

		if ( $result['progress']['progress'] > 50 ) {
			$result['color'] = 'var(--prpl-color-monthly)';
		}
		if ( $result['progress']['progress'] > 75 ) {
			$result['color'] = 'var(--prpl-graph-color-3)';
		}

		$cached[ $category ] = $result;

		return $result;
	}
}
