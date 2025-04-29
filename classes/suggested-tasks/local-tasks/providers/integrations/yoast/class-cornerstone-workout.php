<?php
/**
 * Add tasks for Yoast SEO cornerstone content.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Traits\Dismissable_Task;

/**
 * Add tasks for Yoast SEO cornerstone content.
 */
class Cornerstone_Workout extends Repetitive {
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
		return '<p>' . sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Run the Yoast SEO Cornerstone Content Workout to improve your site\'s SEO. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-cornerstone" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		) . '</p>';
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
