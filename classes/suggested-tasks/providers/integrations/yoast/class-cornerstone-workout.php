<?php
/**
 * Add tasks for Yoast SEO cornerstone content.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Yoast_Provider;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Dismissable_Task;

/**
 * Add tasks for Yoast SEO cornerstone content.
 */
class Cornerstone_Workout extends Yoast_Provider {
	use Dismissable_Task;

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_others_posts';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-cornerstone-workout';

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 90;

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = true;

	/**
	 * The task points.
	 *
	 * @var int
	 */
	protected $points = 3;

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		$this->init_dismissable_task();

		// Hook into update_option.
		\add_action( 'update_option_wpseo_premium', [ $this, 'maybe_update_workout_status' ], 10, 3 );
	}

	/**
	 * Maybe update the workout status.
	 *
	 * @param mixed  $old_value The old value.
	 * @param mixed  $value The new value.
	 * @param string $option The option name.
	 *
	 * @return void
	 */
	public function maybe_update_workout_status( $old_value, $value, $option ) {
		if ( 'wpseo_premium' !== $option || ! isset( $value['workouts']['cornerstone'] ) || ! isset( $old_value['workouts']['cornerstone'] ) ) {
			return;
		}

		// Check if there is a published task.
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $this->get_task_id() ] );

		// If there is no published task, return.
		if ( empty( $tasks ) || 'publish' !== $tasks[0]->post_status ) {
			return;
		}

		// For this type of task only the provider ID is needed, but just in case.
		if ( $this->is_task_dismissed( $tasks[0]->get_data() ) ) {
			return;
		}

		// There should be 3 steps in the workout.
		$workout_was_completed = 3 === \count( $old_value['workouts']['cornerstone']['finishedSteps'] );
		$workout_completed     = 3 === \count( $value['workouts']['cornerstone']['finishedSteps'] );

		// Dismiss the task if workout wasn't completed before and now is.
		if ( ! $workout_was_completed && $workout_completed ) {
			$this->handle_task_dismissal( $this->get_task_id() );
		}
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Yoast SEO: do Yoast SEO\'s Cornerstone Content Workout', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Improve your most important pages with Yoast SEO\'s Cornerstone Content Workout. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/run-cornerstone-content-workout" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Learn more about the Yoast SEO Cornerstone Content Workout', 'progress-planner' ) . '">' . \esc_html__( 'Learn more', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \esc_url( \admin_url( 'admin.php?page=wpseo_workouts#cornerstone' ) );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		if ( ! \defined( 'WPSEO_PREMIUM_VERSION' ) ) {
			return false;
		}

		return ! $this->is_task_dismissed(
			[
				'provider_id' => $this->get_provider_id(),
			]
		);
	}
}
