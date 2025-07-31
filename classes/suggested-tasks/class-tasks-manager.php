<?php
/**
 * Handle suggested tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

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
use Progress_Planner\Suggested_Tasks\Providers\Email_Sending;
use Progress_Planner\Suggested_Tasks\Providers\Set_Valuable_Post_Types;
use Progress_Planner\Suggested_Tasks\Providers\Select_Locale;
use Progress_Planner\Suggested_Tasks\Providers\Fewer_Tags;
use Progress_Planner\Suggested_Tasks\Providers\Remove_Terms_Without_Posts;
use Progress_Planner\Suggested_Tasks\Providers\Update_Term_Description;
use Progress_Planner\Suggested_Tasks\Providers\Collaborator;
use Progress_Planner\Suggested_Tasks\Providers\Select_Timezone;

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
			new Select_Locale(),
			new Remove_Terms_Without_Posts(),
			new Fewer_Tags(),
			new Update_Term_Description(),
			new Collaborator(),
			new Select_Timezone(),
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
				\error_log( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
					\sprintf(
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

		$this->inject_tasks();

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
		if ( 0 === \strpos( $name, 'get_' ) ) {
			$provider_type = \substr( $name, 4 ); // Remove 'get_' prefix.
			$provider_type = \str_replace( '_', '-', \strtolower( $provider_type ) ); // Transform 'update_core' to 'update-core'.

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
	 * @return void
	 */
	public function inject_tasks() {
		// Loop through all registered task providers and inject their tasks.
		foreach ( $this->task_providers as $provider_instance ) {
			// WIP, get_tasks_to_inject() is injecting tasks.
			$provider_instance->get_tasks_to_inject();
		}
	}

	/**
	 * Evaluate tasks stored in the option.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task[]
	 */
	public function evaluate_tasks(): array {
		$tasks           = (array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] );
		$completed_tasks = [];

		foreach ( $tasks as $task ) {
			$task_result = $this->evaluate_task( $task );
			if ( false !== $task_result ) {
				$completed_tasks[] = $task_result;
			}
		}

		return $completed_tasks;
	}

	/**
	 * Evaluate a task.
	 *
	 * @param \Progress_Planner\Suggested_Tasks\Task $task The task to evaluate.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task|false
	 */
	public function evaluate_task( Task $task ) {
		// User tasks are not evaluated.
		if ( \has_term( 'user', 'prpl_recommendations_provider', $task->ID ) ) {
			return false;
		}

		if ( ! $task->provider ) {
			return false;
		}
		$task_provider = $this->get_task_provider( $task->provider->slug );
		if ( ! $task_provider ) {
			return false;
		}

		// Check if the task is no longer relevant.
		if ( ! $task_provider->is_task_relevant() ) {
			// Remove the task from the published tasks.
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
		}

		return $task_provider->evaluate_task( $task->task_id );
	}

	/**
	 * Remove all tasks which have date set to the previous week.
	 * Tasks for the current week will be added automatically.
	 *
	 * @return void
	 */
	public function cleanup_pending_tasks() {
		if ( \progress_planner()->get_utils__cache()->get( 'cleanup_pending_tasks' ) ) {
			return;
		}

		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] );

		foreach ( $tasks as $task ) {
			// Skip user tasks.
			if ( 'user' === $task->get_provider_id() ) {
				continue;
			}

			$task_provider = $this->get_task_provider( $task->get_provider_id() );

			// Should we delete the task? Delete tasks which don't have a task provider or repetitive tasks which were created in the previous week.
			if ( ! $task_provider || ( $task_provider->is_repetitive() && ( ! $task->date || \gmdate( 'YW' ) !== (string) $task->date ) ) ) {
				\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
			}
		}

		\progress_planner()->get_utils__cache()->set( 'cleanup_pending_tasks', true, DAY_IN_SECONDS );
	}
}
