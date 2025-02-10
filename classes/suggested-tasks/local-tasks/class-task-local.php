<?php
/**
 * Local task abstract class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks;

/**
 * Local task abstract class.
 */
class Task_Local {
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
	public function __construct( array $data ) {
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
	 * Get the type of the task.
	 *
	 * @return string
	 */
	public function get_type() {
		return $this->data['type'];
	}

	/**
	 * Alias for get_type().
	 * For compatibility with the old provider system.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return $this->get_type();
	}
}
