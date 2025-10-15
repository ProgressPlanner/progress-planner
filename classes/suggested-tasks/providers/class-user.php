<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for content updates.
 */
class User extends Tasks {

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * Whether the task is snoozable.
	 *
	 * @var bool
	 */
	protected $is_snoozable = false;

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'user';

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_filter( 'progress_planner_suggested_tasks_in_rest_format', [ $this, 'modify_task_details_for_user_tasks_rest_format' ], 10, 2 );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return true;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		return [];
	}

	/**
	 * Get the task details.
	 *
	 * @param array $task_data Optional data to include in the task.
	 *
	 * @return array
	 */
	public function get_task_details( $task_data = [] ) {
		// Get the user tasks from the database.
		$task_post = \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] );
		return $task_post ? $task_post->get_data() : [];
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$actions[] = [
			'priority' => 10,
			'html'     => '<a class="prpl-tooltip-action-text" href="#" target="_self" onclick="event.preventDefault();this.closest(\'li.prpl-suggested-task\').querySelector(\'.prpl-task-title span\').focus();">' . \esc_html__( 'Edit', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}

	/**
	 * Modify the task details for user tasks in REST format.
	 *
	 * @param array $tasks The tasks.
	 * @param array $args  The arguments.
	 *
	 * @return array
	 */
	public function modify_task_details_for_user_tasks_rest_format( $tasks, $args ) {
		static $modified_tasks = [];
		// Only process when fetching user tasks (include_provider contains 'user').
		if ( ! isset( $args['include_provider'] ) || ! \in_array( 'user', $args['include_provider'], true ) ) {
			return $tasks;
		}

		// Loop through all tasks in the flat array.
		foreach ( $tasks as $key => $task ) {
			// Only process user provider tasks.
			if ( ! isset( $task['prpl_provider']->slug ) || $task['prpl_provider']->slug !== self::PROVIDER_ID ) { // @phpstan-ignore-line property.nonObject
				continue;
			}

			if ( \in_array( $task['id'], $modified_tasks, true ) ) {
				continue;
			}

			// Set points: 1 for golden task (excerpt contains 'GOLDEN'), 0 for regular user tasks.
			$task['prpl_points'] = ( isset( $task['excerpt']['rendered'] ) && \str_contains( $task['excerpt']['rendered'], 'GOLDEN' ) ) ? 1 : 0;
			$tasks[ $key ]       = $task;
			$modified_tasks[]    = $task['id'];
		}
		return $tasks;
	}
}
