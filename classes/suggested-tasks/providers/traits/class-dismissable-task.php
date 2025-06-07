<?php
/**
 * Trait for handling dismissable tasks with time-based expiration.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Traits;

/**
 * Trait for handling dismissable tasks with time-based expiration.
 */
trait Dismissable_Task {

	/**
	 * The option name for storing dismissed tasks.
	 * Note: Prior to PHP 8.2 traits cannot have constants.
	 *
	 * @var string
	 */
	protected $dismissed_tasks_option = 'dismissed_tasks';

	/**
	 * The expiration period in seconds.
	 * Default is 6 months.
	 *
	 * @var int
	 */
	protected $dismissal_expiration_period = 6 * MONTH_IN_SECONDS;

	/**
	 * Initialize the dismissable task functionality.
	 *
	 * @return void
	 */
	protected function init_dismissable_task() {
		\add_action( 'progress_planner_ajax_task_complete', [ $this, 'handle_task_dismissal' ], 10, 1 );
		\add_action( 'admin_init', [ $this, 'cleanup_old_dismissals' ] );
		\add_filter( 'progress_planner_task_dismissal_data', [ $this, 'add_post_id_to_dismissal_data' ], 10, 3 );
		\add_filter( 'progress_planner_task_dismissal_data', [ $this, 'add_term_id_to_dismissal_data' ], 10, 3 );
	}

	/**
	 * Handle task dismissal by storing the task data and dismissal date.
	 *
	 * @param string $post_id The post ID.
	 *
	 * @return void
	 */
	public function handle_task_dismissal( $post_id ) {
		// If no task ID is provided, return.
		if ( ! $post_id ) {
			return;
		}

		// Get the task data.
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $post_id );

		// If no task data is found, return.
		if ( ! $task ) {
			return;
		}

		// If the task provider ID does not match, return.
		if ( ! isset( $task->provider->slug ) || $this->get_provider_id() !== $task->provider->slug ) {
			return;
		}

		// Get the dismissed tasks.
		$dismissed_tasks = \progress_planner()->get_settings()->get( $this->dismissed_tasks_option, [] );

		// Get the provider key.
		$provider_id = $this->get_provider_id();

		// If the provider key does not exist, create it.
		if ( ! isset( $dismissed_tasks[ $provider_id ] ) ) {
			$dismissed_tasks[ $provider_id ] = [];
		}

		// Get the task identifier.
		$task_identifier = $this->get_task_identifier( $task->get_data() );

		// If no task identifier is found, return.
		if ( ! $task_identifier ) {
			return;
		}

		// Store the task dismissal data.
		$dismissal_data = [
			'date'      => gmdate( 'YW' ),
			'timestamp' => time(),
		];

		/**
		 * Filter the task dismissal data before it's stored.
		 *
		 * @param array  $dismissal_data The dismissal data.
		 * @param array  $task_data      The task data.
		 * @param string $provider_id    The provider ID.
		 */
		$dismissal_data = \apply_filters( 'progress_planner_task_dismissal_data', $dismissal_data, $task->get_data(), $provider_id );

		$dismissed_tasks[ $provider_id ][ $task_identifier ] = $dismissal_data;

		// Store the dismissed tasks.
		\progress_planner()->get_settings()->set( $this->dismissed_tasks_option, $dismissed_tasks );
	}

	/**
	 * Get the task identifier for storing dismissal data.
	 * Override this method in the implementing class to provide task-specific identification.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string|false The task identifier or false if not applicable.
	 */
	protected function get_task_identifier( $task_data ) {
		$task_identifier = $this->get_provider_id();

		if ( isset( $task_data['target_post_id'] ) ) {
			$task_identifier .= '-' . $task_data['target_post_id'];
		}

		if ( isset( $task_data['target_term_id'] ) ) {
			$task_identifier .= '-' . $task_data['target_term_id'];
		}

		return $task_identifier;
	}

	/**
	 * Get the expiration period in seconds.
	 * Override this method in the implementing class to provide task-specific expiration period.
	 *
	 * @param array $dismissal_data The dismissal data.
	 *
	 * @return int The expiration period in seconds.
	 */
	protected function get_expiration_period( $dismissal_data = [] ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
		return 6 * MONTH_IN_SECONDS;
	}

	/**
	 * Check if a task has been dismissed.
	 *
	 * @param array $task_data The task data to check.
	 *
	 * @return bool
	 */
	protected function is_task_dismissed( $task_data ) {
		$dismissed_tasks = \progress_planner()->get_settings()->get( $this->dismissed_tasks_option, [] );
		$provider_key    = $this->get_provider_id();

		if ( ! isset( $dismissed_tasks[ $provider_key ] ) ) {
			return false;
		}

		$task_identifier = $this->get_task_identifier( $task_data );
		if ( ! $task_identifier || ! isset( $dismissed_tasks[ $provider_key ][ $task_identifier ] ) ) {
			return false;
		}

		$dismissal_data = $dismissed_tasks[ $provider_key ][ $task_identifier ];

		// If the task was dismissed in the current week, don't show it again.
		if ( $dismissal_data['date'] === gmdate( 'YW' ) ) {
			return true;
		}

		// If the task was dismissed more than the expiration period ago, we can show it again.
		if ( ( time() - $dismissal_data['timestamp'] ) > $this->get_expiration_period( $dismissal_data ) ) {
			unset( $dismissed_tasks[ $provider_key ][ $task_identifier ] );
			\progress_planner()->get_settings()->set( $this->dismissed_tasks_option, $dismissed_tasks );
			return false;
		}

		return true;
	}

	/**
	 * Get the provider dismissed tasks.
	 *
	 * @return array
	 */
	public function get_dismissed_tasks() {
		$dismissed_tasks = \progress_planner()->get_settings()->get( $this->dismissed_tasks_option, [] );
		return $dismissed_tasks[ $this->get_provider_id() ] ?? [];
	}

	/**
	 * Clean up old dismissals for this provider.
	 *
	 * @return void
	 */
	public function cleanup_old_dismissals() {
		$cleanup_recently_performed = \progress_planner()->get_utils__cache()->get( 'cleanup_dismissed_tasks' );

		if ( $cleanup_recently_performed ) {
			return;
		}

		$dismissed_tasks = \progress_planner()->get_settings()->get( $this->dismissed_tasks_option, [] );
		$provider_key    = $this->get_provider_id();

		if ( ! isset( $dismissed_tasks[ $provider_key ] ) ) {
			return;
		}

		$has_changes = false;
		foreach ( $dismissed_tasks[ $provider_key ] as $identifier => $data ) {
			if ( ( time() - $data['timestamp'] ) > $this->get_expiration_period( $data ) ) {
				unset( $dismissed_tasks[ $provider_key ][ $identifier ] );
				$has_changes = true;
			}
		}

		if ( $has_changes ) {
			\progress_planner()->get_settings()->set( $this->dismissed_tasks_option, $dismissed_tasks );
		}

		// Set transient to prevent running cleanup again today.
		\progress_planner()->get_utils__cache()->set( 'cleanup_dismissed_tasks', true, DAY_IN_SECONDS );
	}

	/**
	 * Add post ID to dismissal data.
	 *
	 * @param array  $dismissal_data The dismissal data.
	 * @param array  $task_data      The task data.
	 * @param string $provider_id    The provider ID.
	 *
	 * @return array
	 */
	public function add_post_id_to_dismissal_data( $dismissal_data, $task_data, $provider_id ) {
		if ( $this->get_provider_id() === $provider_id && isset( $task_data['target_post_id'] ) ) {
			$dismissal_data['post_id'] = $task_data['target_post_id'];
		}
		return $dismissal_data;
	}

	/**
	 * Add term ID to dismissal data.
	 *
	 * @param array  $dismissal_data The dismissal data.
	 * @param array  $task_data      The task data.
	 * @param string $provider_id    The provider ID.
	 *
	 * @return array
	 */
	public function add_term_id_to_dismissal_data( $dismissal_data, $task_data, $provider_id ) {
		if ( $this->get_provider_id() === $provider_id && isset( $task_data['target_term_id'] ) ) {
			$dismissal_data['term_id'] = $task_data['target_term_id'];
		}
		return $dismissal_data;
	}
}
