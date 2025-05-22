<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

use Progress_Planner\Badges\Monthly;
use Progress_Planner\Suggested_Tasks\Task_Factory;
use Progress_Planner\Suggested_Tasks\Providers\Content_Review;

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
	 * Get the score.
	 *
	 * @return int The score.
	 */
	public function get_score() {
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category'   => 'suggested_task',
				'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) ),
				'end_date'   => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-t' ) ),
			]
		);

		$score = 0;
		foreach ( $activities as $activity ) {
			$score += $activity->get_points( $activity->date );
		}

		return (int) min( Monthly::TARGET_POINTS, max( 0, floor( $score ) ) );
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {

		// Set max items per category.
		$max_items_per_category = [];
		$provider_categories    = \get_terms(
			[
				'taxonomy'   => 'prpl_recommendations_category',
				'hide_empty' => false,
			]
		);

		if ( ! empty( $provider_categories ) && ! is_wp_error( $provider_categories ) ) {
			$content_review_category = ( new Content_Review() )->get_provider_category();
			foreach ( $provider_categories as $provider_category ) {
				$max_items_per_category[ $provider_category->slug ] = $provider_category->slug === $content_review_category ? 2 : 1;
			}
		}

		// This should never happen, but just in case - user tasks are displayed in different widget.
		if ( isset( $max_items_per_category['user'] ) ) {
			$max_items_per_category['user'] = 100;
		}

		// Celebrate only on the Progress Planner Dashboard page.
		$delay_celebration = false;
		if ( \progress_planner()->is_on_progress_planner_dashboard_page() ) {
			// should_show_upgrade_popover() also checks if we're on the Progress Planner Dashboard page - but let's be explicit since that method might change in the future.
			$delay_celebration = \progress_planner()->get_plugin_upgrade_tasks()->should_show_upgrade_popover();
		}

		// Enqueue the script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'widgets/suggested-tasks',
			[
				'name' => 'prplSuggestedTasks',
				'data' => [
					'ajaxUrl'             => \admin_url( 'admin-ajax.php' ),
					'nonce'               => \wp_create_nonce( 'progress_planner' ),
					'tasks'               => [], // This is set in the JS file.
					'maxItemsPerCategory' => apply_filters( 'progress_planner_suggested_tasks_max_items_per_category', $max_items_per_category ),
					'delayCelebration'    => $delay_celebration,
				],
			]
		);

		// Enqueue the badge scroller script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'widgets/suggested-tasks-badge-scroller',
		);
	}

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		// Register styles for the web-component.
		\wp_register_style(
			'progress-planner-web-components-prpl-suggested-task',
			constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/web-components/prpl-suggested-task.css',
			[],
			\progress_planner()->get_file_version( constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/web-components/prpl-suggested-task.css' )
		);

		return [
			'progress-planner-web-components-prpl-suggested-task',
		];
	}
}
