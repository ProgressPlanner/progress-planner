<?php
/**
 * Handle suggested tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

use Progress_Planner\Suggested_Tasks\Tasks_Interface;
use Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Add_Yoast_Providers;
use Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO\Add_AIOSEO_Providers;
use Progress_Planner\Suggested_Tasks\Providers\User as User_Tasks;

/**
 * Tasks_Manager class.
 */
class Tasks_Manager {

	/**
	 * React provider IDs.
	 *
	 * These providers have been migrated to React and should not be
	 * cleaned up or evaluated by PHP. PHP will skip tasks from these
	 * providers in cleanup_pending_tasks() and evaluate_task().
	 *
	 * @var array<string>
	 */
	private const REACT_PROVIDERS = [
		'core-blogdescription',
		'core-permalink-structure',
		'core-siteicon',
		'create-post',
		'disable-comment-pagination',
		'disable-comments',
		'fewer-tags',
		'hello-world',
		'improve-pdf-handling',
		'php-version',
		'reduce-autoloaded-options',
		'remove-inactive-plugins',
		'remove-terms-without-posts',
		'rename-uncategorized-category',
		'review-post',
		'sample-page',
		'search-engine-visibility',
		'select-locale',
		'select-timezone',
		'sending-email',
		'seo-plugin',
		'set-date-format',
		'set-page-about',
		'set-page-contact',
		'set-page-faq',
		'set-valuable-post-types',
		'unpublished-content',
		'update-core',
		'update-term-description',
		'user',
		'wp-debug-display',
		// Yoast SEO integration tasks.
		'yoast-author-archive',
		'yoast-date-archive',
		'yoast-format-archive',
		'yoast-media-pages',
		'yoast-crawl-settings-emoji-scripts',
		'yoast-crawl-settings-feed-authors',
		'yoast-crawl-settings-feed-global-comments',
		'yoast-organization-logo',
		'yoast-cornerstone-workout',
		'yoast-orphaned-content-workout',
		'yoast-fix-orphaned-content',
		// AIOSEO integration tasks.
		'aioseo-organization-logo',
		'aioseo-author-archive',
		'aioseo-date-archive',
		'aioseo-media-pages',
		'aioseo-crawl-settings-feed-authors',
		'aioseo-crawl-settings-feed-comments',
	];

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
		// Note: Most providers have been migrated to React (see REACT_PROVIDERS constant).
		$this->task_providers = [
			new User_Tasks(),
		];

		// Add the plugin integration.
		\add_action( 'plugins_loaded', [ $this, 'add_plugin_integration' ] );

		// At this point both local and task providers for the plugins we integrate with are instantiated, so initialize them.
		\add_action( 'init', [ $this, 'init' ], 99 ); // Wait for the post types to be initialized.

		// Add the cleanup action.
		\add_action( 'admin_init', [ $this, 'cleanup_pending_tasks' ] );

		// Handle tasks when snoozed period is over.
		\add_action( 'transition_post_status', [ $this, 'handle_task_unsnooze' ], 10, 3 );
	}

	/**
	 * Add the plugin integrations if the plugins are active.
	 *
	 * @return void
	 */
	public function add_plugin_integration() {
		// Yoast SEO integration.
		new Add_Yoast_Providers();

		// All in One SEO integration.
		new Add_AIOSEO_Providers();
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
	 * Get the user available task providers, based on the capability required and the user role.
	 *
	 * @return array
	 */
	public function get_task_providers_available_for_user() {
		return \array_filter(
			$this->task_providers,
			function ( $task_provider ) {
				return $task_provider->capability_required();
			}
		);
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
	 * Check if a provider ID belongs to a React provider.
	 *
	 * React providers are registered in JavaScript and their tasks
	 * should not be cleaned up or evaluated by PHP.
	 *
	 * @param string $provider_id The provider ID to check.
	 *
	 * @return bool True if this is a React provider, false otherwise.
	 */
	public function is_react_provider( string $provider_id ): bool {
		return \in_array( $provider_id, self::REACT_PROVIDERS, true );
	}

	/**
	 * Get all React provider IDs.
	 *
	 * Returns the list of provider IDs that have been migrated to React.
	 * These are used to include React-created tasks in REST API queries.
	 *
	 * @return array<string> Array of React provider IDs.
	 */
	public function get_react_provider_ids(): array {
		return self::REACT_PROVIDERS;
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
			// Skip React providers - they handle their own evaluation.
			if ( $this->is_react_provider( $task->provider->slug ) ) {
				return false;
			}
			// Unknown provider - delete orphan task.
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
			return false;
		}
		if ( ! $task_provider->is_task_relevant() ) {
			// Remove the task from the published tasks.
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
			return false;
		}

		return $task_provider->evaluate_task( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ) );
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

			// Skip React providers - they manage their own cleanup.
			if ( ! $task_provider && $this->is_react_provider( $task->get_provider_id() ) ) {
				continue;
			}

			// Delete tasks without provider (orphans) or stale repetitive tasks.
			if ( ! $task_provider || ( $task_provider->is_repetitive() && ( ! $task->date || \gmdate( 'YW' ) !== (string) $task->date ) ) ) {
				\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
			}
		}

		\progress_planner()->get_utils__cache()->set( 'cleanup_pending_tasks', true, DAY_IN_SECONDS );
	}

	/**
	 * Handle task unsnooze.
	 *
	 * @param string   $new_status The new status.
	 * @param string   $old_status The old status.
	 * @param \WP_Post $post The post.
	 *
	 * @return void
	 */
	public function handle_task_unsnooze( $new_status, $old_status, $post ) {
		// Early exit if it's not task for which snooze period is over.
		if ( 'future' !== $old_status || 'publish' !== $new_status || 'prpl_recommendations' !== \get_post_type( $post ) ) {
			return;
		}

		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $post->ID );
		if ( ! $task ) {
			return;
		}

		$task_provider = $this->get_task_provider( $task->get_provider_id() );

		// Skip React providers - they manage their own cleanup.
		if ( ! $task_provider && $this->is_react_provider( $task->get_provider_id() ) ) {
			return;
		}

		// Delete tasks which don't have a task provider or repetitive tasks which were created in the previous week.
		if ( ! $task_provider || ( $task_provider->is_repetitive() && ( ! $task->date || \gmdate( 'YW' ) !== (string) $task->date ) ) ) {
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
		}

		// Delete the task if it is not relevant anymore.
		if ( $task_provider instanceof \Progress_Planner\Suggested_Tasks\Providers\Tasks && ! $task_provider->should_add_task() ) {
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
		}
	}
}
