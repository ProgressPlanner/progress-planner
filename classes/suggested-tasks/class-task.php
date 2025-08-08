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
 * @property int $priority The task priority (0-100, 0 being highest and 100 being lowest).
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
 * @property string|null $date The task date in YW format (year-week)
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
		// Delete only if the task is already saved in the database.
		if ( $this->ID ) {
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $this->ID );
		}

		// Clear the data.
		$this->data = [];
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
		return isset( $this->data['post_status'] ) && \in_array( $this->data['post_status'], [ 'trash', 'pending' ], true );
	}

	/**
	 * Set the task status to pending.
	 *
	 * @return bool
	 */
	public function celebrate(): bool {
		return $this->ID && \progress_planner()->get_suggested_tasks_db()->update_recommendation( $this->ID, [ 'post_status' => 'pending' ] );
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
	 * Get the category.
	 *
	 * @return string
	 */
	public function get_category(): string {
		return $this->data['category']->slug ?? '';
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
	 * Get the REST formatted data.
	 *
	 * @param int|null $post_id The post ID.
	 *
	 * @return array
	 */
	public function get_rest_formatted_data( $post_id = null ): array {
		if ( ! $post_id ) {
			$post_id = $this->ID;
		}

		$post = \get_post( $post_id );
		if ( ! $post ) {
			return [];
		}

		// Make sure WP_REST_Posts_Controller is loaded.
		if ( ! \class_exists( 'WP_REST_Posts_Controller' ) ) {
			require_once ABSPATH . 'wp-includes/rest-api/endpoints/class-wp-rest-posts-controller.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		// Make sure WP_REST_Request is loaded.
		if ( ! \class_exists( 'WP_REST_Request' ) ) {
			require_once ABSPATH . 'wp-includes/rest-api/class-wp-rest-request.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		// Use the appropriate controller for the post type.
		$controller = new \WP_REST_Posts_Controller( $post->post_type );

		// Build dummy request object.
		$request = new \WP_REST_Request();
		$request->set_param( 'context', 'view' );

		// Get formatted response.
		$response = $controller->prepare_item_for_response( $post, $request );

		return $response->get_data();
	}
}
