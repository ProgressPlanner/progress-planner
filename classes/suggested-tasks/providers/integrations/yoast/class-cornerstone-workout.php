<?php
/**
 * Add tasks for Yoast SEO cornerstone content.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Providers\Tasks;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Dismissable_Task;

/**
 * Add tasks for Yoast SEO cornerstone content.
 */
class Cornerstone_Workout extends Tasks {
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
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'configuration';

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'low';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;


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
		if ( 'wpseo_premium' !== $option || ! isset( $value['workouts']['cornerstone'] ) ) {
			return;
		}

		// Check if there is pending task.
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $this->get_task_id() );

		// If there is no pending task, return.
		if ( empty( $tasks ) || 'pending' !== $tasks[0]['status'] ) {
			return;
		}

		// For this type of task only the provider ID is needed, but just in case.
		if ( $this->is_task_dismissed( $tasks[0] ) ) {
			return;
		}

		$workout_completed = count( $value['workouts']['cornerstone']['finishedSteps'] ) === 3; // There should be 3 steps in the workout.

		// Dismiss the task if it's completed.
		if ( true === $workout_completed ) {
			$this->handle_task_dismissal( $this->get_task_id() );
		}
	}

	/**
	 * Get the task title.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_title( $task_id = '' ) {
		return \esc_html__( 'Run Yoast SEO Cornerstone Content Workout', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_description( $task_id = '' ) {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Run the Yoast SEO Cornerstone Content Workout to improve your site\'s SEO. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-cornerstone" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the Yoast SEO Cornerstone Content Workout', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the task URL.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_url( $task_id = '' ) {
		return $this->capability_required() ? \esc_url( admin_url( 'admin.php?page=wpseo_workouts' ) ) : '';
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		if ( ! function_exists( 'YoastSEO' ) ) {
			return false;
		}

		$task_data = [
			'provider_id' => $this->get_provider_id(),
		];

		// Skip if the task has been dismissed.
		if ( $this->is_task_dismissed( $task_data ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		if ( ! $this->should_add_task() ) {
			return [];
		}

		return [
			[
				'task_id'     => $this->get_task_id(),
				'provider_id' => $this->get_provider_id(),
				'category'    => $this->get_provider_category(),
				'date'        => \gmdate( 'YW' ),
			],
		];
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {
		if ( ! $task_id ) {
			return [];
		}

		return [
			'task_id'     => $task_id,
			'provider_id' => $this->get_provider_id(),
			'title'       => $this->get_title( $task_id ),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable,
			'url'         => $this->get_url( $task_id ),
			'url_target'  => $this->get_url_target(),
			'description' => $this->get_description( $task_id ),
		];
	}
}
