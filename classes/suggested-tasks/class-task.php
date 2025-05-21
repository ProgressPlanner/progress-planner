<?php
/**
 * Task abstract class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

/**
 * Task abstract class.
 */
class Task {
	/**
	 * The task data.
	 *
	 * @var array
	 */
	protected array $data;

	/**
	 * Constructor.
	 *
	 * @param array $data The task data.
	 */
	public function __construct( array $data = [] ) {
		$this->data = $data;
	}

	/**
	 * Get the task data.
	 *
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}

	/**
	 * Set the task data.
	 *
	 * @param array $data The task data.
	 *
	 * @return void
	 */
	public function set_data( array $data ) {
		$this->data = $data;
	}

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return $this->data['provider']->slug ?? '';
	}

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_task_id() {
		return $this->data['task_id'] ?? '';
	}

	/**
	 * Get the provider ID.
	 *
	 * @return array
	 */
	public function get_task_details() {
		$task_provider_id = $this->get_provider_id();
		$task_id          = $this->get_task_id();

		$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_provider_id );
		return $task_provider ? $task_provider->get_task_details( $task_id ) : [];
	}
}
