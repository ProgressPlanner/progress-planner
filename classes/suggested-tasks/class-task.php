<?php
/**
 * Task abstract class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

/**
 * Task abstract class.
 *
 * @property int $ID The task ID
 * @property string $post_status The task status
 * @property string $post_title The task title
 * @property string $post_date The task date
 * @property \stdClass|null $provider The task provider object with slug property
 * @property string $task_id The task identifier
 * @property string $provider_id The provider identifier
 * @property string $category The task category
 * @property string $priority The task priority
 * @property int $points The task points
 * @property bool $dismissable Whether the task is dismissable
 * @property string $url The task URL
 * @property string $url_target The task URL target
 * @property string $description The task description
 * @property array $data The task data array
 * @property int|null $target_post_id The target post ID for the task
 * @property int|null $target_term_id The target term ID for the task
 * @property string|null $target_taxonomy The target taxonomy for the task
 * @property string|null $target_term_name The target term name for the task
 */
class Task {
	/**
	 * The task data.
	 *
	 * @var array<string, mixed>
	 */
	protected array $data;

	/**
	 * Constructor.
	 *
	 * @param array<string, mixed> $data The task data.
	 */
	public function __construct( array $data = [] ) {
		$this->data = $data;
	}

	/**
	 * Get the task data.
	 *
	 * @return array<string, mixed>
	 */
	public function get_data(): array {
		return $this->data;
	}

	/**
	 * Set the task data.
	 *
	 * @param array<string, mixed> $data The task data.
	 *
	 * @return void
	 */
	public function set_data( array $data ): void {
		$this->data = $data;
	}

	/**
	 * Update the task data.
	 *
	 * @param array<string, mixed> $data The task data.
	 *
	 * @return void
	 */
	public function update( array $data ): void {
		$this->data = $data;

		// Update only if the task is already saved in the database.
		if ( $this->ID ) {
			\progress_planner()->get_suggested_tasks_db()->update_recommendation( $this->ID, $this->data );
		}
	}

	/**
	 * Delete the task.
	 *
	 * @return void
	 */
	public function delete(): void {
		$this->data = [];
		// Delete only if the task is already saved in the database.
		if ( $this->ID ) {
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $this->ID );
		}
	}

	/**
	 * Check if the task is snoozed.
	 *
	 * @return bool
	 */
	public function is_snoozed(): bool {
		return isset( $this->data['post_status'] ) && 'future' === $this->data['post_status'];
	}

	/**
	 * Get the snoozed until date.
	 *
	 * @return \DateTime|null|false
	 */
	public function snoozed_until() {
		return isset( $this->data['post_date'] ) ? \DateTime::createFromFormat( 'Y-m-d H:i:s', $this->data['post_date'] ) : null;
	}

	/**
	 * Check if the task is completed.
	 *
	 * @return bool
	 */
	public function is_completed(): bool {
		return isset( $this->data['post_status'] ) && in_array( $this->data['post_status'], [ 'trash', 'pending' ], true );
	}

	/**
	 * Set the task status to pending.
	 *
	 * @return bool
	 */
	public function celebrate(): bool {
		if ( ! $this->ID ) {
			return false;
		}

		return \progress_planner()->get_suggested_tasks_db()->update_recommendation( $this->ID, [ 'post_status' => 'pending' ] );
	}

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id(): string {
		return $this->data['provider']->slug ?? '';
	}

	/**
	 * Get the task ID.
	 *
	 * @return string
	 */
	public function get_task_id(): string {
		return $this->data['task_id'] ?? '';
	}

	/**
	 * Magic getter.
	 *
	 * @param string $key The key.
	 *
	 * @return mixed
	 */
	public function __get( string $key ) {
		return $this->data[ $key ] ?? null;
	}

	/**
	 * Get the task details.
	 *
	 * @return array<string, mixed>
	 */
	public function get_task_details(): array {
		$task_provider_id = $this->get_provider_id();
		$task_id          = $this->get_task_id();

		$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_provider_id );
		return $task_provider ? $task_provider->get_task_details( $task_id ) : [];
	}
}
