<?php
/**
 * Add tasks for hello world.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks for hello world post.
 */
class Hello_World extends Local_Tasks_Abstract {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const TYPE = 'hello-world';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'edit_posts';

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() ) {
			return false;
		}

		$hello_world = get_page_by_path( 'hello-world', OBJECT, 'post' );

		if ( $hello_world !== null ) {
			return $task_id;
		}
		return false;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {

		// Early bail if the user does not have the capability to manage options or if the task is snoozed.
		if ( true === $this->is_task_type_snoozed() || ! $this->capability_required() ) {
			return [];
		}

		if ( null === get_page_by_path( 'hello-world', OBJECT, 'post' ) ) {
			return [];
		}

		$task_id = self::TYPE . '-' . \gmdate( 'YW' );

		return [
			$this->get_task_details( self::TYPE . '-' . \gmdate( 'YW' ) ),
		];
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id ) {

		$hello_world = get_page_by_path( 'hello-world', OBJECT, 'post' );
		if ( null === $hello_world ) {
			return [];
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Delete "Hello World!" post', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => 'maintenance',
			'points'      => 1,
			'url'         => admin_url( 'post.php?post=' . $hello_world->ID . '&action=edit' ),
			'description' => '<p>' . \esc_html__( 'On install, WordPress creates a "Hello World!" post. This post is not needed and should be deleted.', 'progress-planner' ) . '</p>',
		];
	}

	/**
	 * Get the data from a task-ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array The data.
	 */
	public function get_data_from_task_id( $task_id ) {
		$data = [
			'type' => self::TYPE,
			'id'   => $task_id,
		];

		return $data;
	}

	/**
	 * Check if a task type is snoozed.
	 *
	 * @return bool
	 */
	public function is_task_type_snoozed() {
		$snoozed = \progress_planner()->get_suggested_tasks()->get_snoozed_tasks();
		if ( ! \is_array( $snoozed ) || empty( $snoozed ) ) {
			return false;
		}

		foreach ( $snoozed as $task ) {
			if ( self::TYPE === $task['id'] ) {
				return true;
			}
		}

		return false;
	}
}
