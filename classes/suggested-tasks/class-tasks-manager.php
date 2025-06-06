<?php
/**
 * Handle suggested tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

use Progress_Planner\Suggested_Tasks\Task_Factory;

use Progress_Planner\Suggested_Tasks\Providers\Core_Update;
use Progress_Planner\Suggested_Tasks\Providers\Content_Create;
use Progress_Planner\Suggested_Tasks\Providers\Content_Review;
use Progress_Planner\Suggested_Tasks\Providers\Blog_Description;
use Progress_Planner\Suggested_Tasks\Providers\Settings_Saved;
use Progress_Planner\Suggested_Tasks\Providers\Debug_Display;
use Progress_Planner\Suggested_Tasks\Providers\Disable_Comments;
use Progress_Planner\Suggested_Tasks\Providers\Sample_Page;
use Progress_Planner\Suggested_Tasks\Providers\Hello_World;
use Progress_Planner\Suggested_Tasks\Providers\Remove_Inactive_Plugins;
use Progress_Planner\Suggested_Tasks\Providers\Site_Icon;
use Progress_Planner\Suggested_Tasks\Providers\Rename_Uncategorized_Category;
use Progress_Planner\Suggested_Tasks\Providers\Permalink_Structure;
use Progress_Planner\Suggested_Tasks\Providers\Php_Version;
use Progress_Planner\Suggested_Tasks\Providers\Search_Engine_Visibility;
use Progress_Planner\Suggested_Tasks\Tasks_Interface;
use Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Add_Yoast_Providers;
use Progress_Planner\Suggested_Tasks\Providers\User as User_Tasks;
use Progress_Planner\Suggested_Tasks\Providers\Interactive\Email_Sending;
use Progress_Planner\Suggested_Tasks\Providers\Set_Valuable_Post_Types;
use Progress_Planner\Suggested_Tasks\Providers\Fewer_Tags;
use Progress_Planner\Suggested_Tasks\Providers\Remove_Terms_Without_Posts;
use Progress_Planner\Suggested_Tasks\Providers\Update_Term_Description;

/**
 * Tasks_Manager class.
 */
class Tasks_Manager {

	/**
	 * The task providers.
	 *
	 * @var array
	 */
	private $task_providers = [];

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Instantiate task providers.
		$this->task_providers = [
			new Content_Create(),
			new Content_Review(),
			new Core_Update(),
			new Blog_Description(),
			new Settings_Saved(),
			new Debug_Display(),
			new Disable_Comments(),
			new Sample_Page(),
			new Hello_World(),
			new Remove_Inactive_Plugins(),
			new Site_Icon(),
			new Rename_Uncategorized_Category(),
			new Permalink_Structure(),
			new Php_Version(),
			new Search_Engine_Visibility(),
			new User_Tasks(),
			new Email_Sending(),
			new Set_Valuable_Post_Types(),
			new Remove_Terms_Without_Posts(),
			new Fewer_Tags(),
			new Update_Term_Description(),
		];

		// Add the plugin integration.
		\add_action( 'plugins_loaded', [ $this, 'add_plugin_integration' ] );

		// At this point both local and task providers for the plugins we integrate with are instantiated, so initialize them.
		\add_action( 'init', [ $this, 'init' ], 99 ); // Wait for the post types to be initialized.

		// Add the cleanup action.
		\add_action( 'admin_init', [ $this, 'cleanup_pending_tasks' ] );
	}

	/**
	 * Add the Yoast task if the plugin is active.
	 *
	 * @return void
	 */
	public function add_plugin_integration() {

		// Yoast SEO integration.
		new Add_Yoast_Providers();
	}

	/**
	 * Initialize the task providers.
	 *
	 * @return void
	 */
	public function init() {

		/**
		 * Filter the task providers, 3rd party providers are added here as well.
		 *
		 * @param array $task_providers The task providers.
		 */
		$this->task_providers = \apply_filters( 'progress_planner_suggested_tasks_providers', $this->task_providers );

		// Now when all are instantiated, initialize them.
		foreach ( $this->task_providers as $key => $task_provider ) {
			if ( ! $task_provider instanceof Tasks_Interface ) {
				error_log( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
					sprintf(
						'Task provider %1$s is not an instance of %2$s',
						$task_provider->get_provider_id(),
						Tasks_Interface::class
					)
				);
				unset( $this->task_providers[ $key ] );

				continue;
			}

			// Initialize the task provider (add hooks, etc.).
			$task_provider->init();
		}

		// Inject tasks.
		\add_filter( 'progress_planner_suggested_tasks_items', [ $this, 'inject_tasks' ] );

		// Add the onboarding task providers.
		\add_filter( 'prpl_onboarding_task_providers', [ $this, 'add_onboarding_task_providers' ] );
	}

	/**
	 * Add the onboarding task providers.
	 *
	 * @param array $task_providers The task providers.
	 *
	 * @return array
	 */
	public function add_onboarding_task_providers( $task_providers ) {

		foreach ( $this->task_providers as $task_provider ) {

			if ( $task_provider->is_onboarding_task() ) {
				$task_providers[] = $task_provider->get_provider_id();
			}
		}

		return $task_providers;
	}

	/**
	 * Get a task provider.
	 *
	 * @param string $name The method name.
	 * @param array  $arguments The arguments.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Tasks_Interface|null
	 */
	public function __call( $name, $arguments ) {
		if ( 0 === strpos( $name, 'get_' ) ) {
			$provider_type = substr( $name, 4 ); // Remove 'get_' prefix.
			$provider_type = str_replace( '_', '-', strtolower( $provider_type ) ); // Transform 'update_core' to 'update-core'.

			return $this->get_task_provider( $provider_type );
		}

		return null;
	}

	/**
	 * Get the task providers.
	 *
	 * @return array
	 */
	public function get_task_providers() {
		return $this->task_providers;
	}

	/**
	 * Get a task provider by its ID.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Tasks_Interface|null
	 */
	public function get_task_provider( $provider_id ) {
		foreach ( $this->task_providers as $provider_instance ) {
			if ( $provider_instance->get_provider_id() === $provider_id ) {
				return $provider_instance;
			}
		}

		return null;
	}

	/**
	 * Inject tasks.
	 *
	 * @param array $tasks The tasks.
	 *
	 * @return array
	 */
	public function inject_tasks( $tasks ) {
		$provider_tasks  = [];
		$tasks_to_inject = [];

		// Loop through all registered task providers and inject their tasks.
		foreach ( $this->task_providers as $provider_instance ) {
			$provider_tasks = \array_merge( $provider_tasks, $provider_instance->get_tasks_to_inject() );
		}

		// Add the tasks to the pending tasks option, it will not add duplicates.
		foreach ( $provider_tasks as $task ) {

			// Skip the task if it was completed.
			if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task['task_id'] ) ) {
				continue;
			}

			$tasks_to_inject[] = $task;
			$this->add_pending_task( $task );
		}

		return \array_merge( $tasks, $tasks_to_inject );
	}

	/**
	 * Evaluate tasks stored in the option.
	 *
	 * @return array
	 */
	public function evaluate_tasks() {
		$tasks           = (array) \progress_planner()->get_suggested_tasks()->get_tasks_by( 'status', 'pending' );
		$completed_tasks = [];

		foreach ( $tasks as $task_data ) {
			if ( ! isset( $task_data['task_id'] ) ) {
				continue;
			}

			$task_id = $task_data['task_id'];

			// Check if the task is no longer relevant.
			$task_object   = Task_Factory::create_task_from( 'id', $task_id );
			$task_provider = $this->get_task_provider( $task_object->get_provider_id() );
			if ( $task_provider && ! $task_provider->is_task_relevant() ) {
				// Remove the task from the pending tasks.
				\progress_planner()->get_suggested_tasks()->delete_task( $task_id );
			}

			$task_result = $this->evaluate_task( $task_id );
			if ( false !== $task_result ) {
				$completed_tasks[] = $task_result;
			}
		}

		return $completed_tasks;
	}

	/**
	 * Wrapper function for evaluating tasks.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|\Progress_Planner\Suggested_Tasks\Task
	 */
	public function evaluate_task( $task_id ) {
		$task_object   = Task_Factory::create_task_from( 'id', $task_id );
		$task_provider = $this->get_task_provider( $task_object->get_provider_id() );

		if ( ! $task_provider ) {
			return false;
		}

		return $task_provider->evaluate_task( $task_id );
	}

	/**
	 * Wrapper function for getting task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array|false
	 */
	public function get_task_details( $task_id ) {
		$task_object   = Task_Factory::create_task_from( 'id', $task_id );
		$task_provider = $this->get_task_provider( $task_object->get_provider_id() );

		if ( ! $task_provider ) {
			return false;
		}

		return $task_provider->get_task_details( $task_id );
	}

	/**
	 * Wrapper function for getting task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_data_from_task_id( $task_id ) {
		$task_object = Task_Factory::create_task_from( 'id', $task_id );

		return $task_object->get_data();
	}

	/**
	 * Add a pending task.
	 *
	 * @param array $task The task data.
	 *
	 * @return bool
	 */
	public function add_pending_task( $task ) {
		$tasks = \progress_planner()->get_settings()->get( 'tasks', [] );

		$task_index = false;

		foreach ( $tasks as $key => $_task ) {
			if ( ! isset( $_task['task_id'] ) || $task['task_id'] !== $_task['task_id'] ) {
				continue;
			}
			$task_index = $key;
			break;
		}

		$task['status'] = 'pending';

		if ( false !== $task_index ) {
			$tasks[ $task_index ] = array_merge( $task, $tasks[ $task_index ] );
		} else {
			$tasks[] = $task;
		}

		return \progress_planner()->get_settings()->set( 'tasks', $tasks );
	}

	/**
	 * Remove all tasks which have date set to the previous week.
	 * Tasks for the current week will be added automatically.
	 *
	 * @return void
	 */
	public function cleanup_pending_tasks() {

		$cleanup_recently_performed = \progress_planner()->get_utils__cache()->get( 'cleanup_pending_tasks' );

		if ( $cleanup_recently_performed ) {
			return;
		}

		$tasks = (array) \progress_planner()->get_settings()->get( 'tasks', [] );

		if ( empty( $tasks ) ) {
			return;
		}

		$task_count = count( $tasks );

		$tasks = \array_filter(
			$tasks,
			function ( $task ) {

				if ( 'pending' === $task['status'] && isset( $task['date'] ) ) {
					return (string) \gmdate( 'YW' ) === (string) $task['date'];
				}

				// We have changed provider_id name, so we need to remove all tasks of the old provider_id.
				if ( isset( $task['provider_id'] ) && 'update-post' === $task['provider_id'] ) {
					return false;
				}

				return true;
			}
		);

		if ( count( $tasks ) !== $task_count ) {
			\progress_planner()->get_settings()->set( 'tasks', array_values( $tasks ) );
		}

		\progress_planner()->get_utils__cache()->set( 'cleanup_pending_tasks', true, DAY_IN_SECONDS );
	}
}
