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
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return $this->data['provider_id'] ?? $this->data['type'];
	}
}
