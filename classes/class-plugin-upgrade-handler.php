<?php
/**
 * Handle plugin onboarding and upgrade task related functionality.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Plugin_Upgrade_Handler class.
 */
class Plugin_Upgrade_Handler {

	/**
	 * IDs of the task providers that should be shown to user during onboarding or updating the plugin.
	 *
	 * @var array
	 */
	private $whitelisted_task_provider_ids;

	/**
	 * Constructor.
	 */
	public function __construct() {

		// We should update this array when we add new task providers we want to show.
		$this->whitelisted_task_provider_ids = apply_filters(
			'prpl_onboarding_task_providers',
			[
				'core-blogdescription',
				'core-siteicon',
				'debug-display',
				'disable-comments',
				'hello-world',
				'sample-page',
				'php-version',
			]
		);
	}

	/**
	 * Get the IDs of the newly added task providers.
	 *
	 * @return array
	 */
	public function get_newly_added_task_provider_ids() {
		static $newly_added_task_providers;

		if ( null === $newly_added_task_providers ) {

			// Check if task providers option exists, it will not on fresh installs.
			$old_task_providers = \get_option( 'progress_planner_previous_version_task_providers', [] );

			$newly_added_task_providers = [];

			foreach ( $this->whitelisted_task_provider_ids as $task_provider_id ) {
				if ( ! in_array( $task_provider_id, $old_task_providers, true ) ) {
					$newly_added_task_providers[] = $task_provider_id;
				}
			}

			// Update 'progress_planner_previous_version_task_providers' option.
			\update_option( 'progress_planner_previous_version_task_providers', $this->whitelisted_task_provider_ids );
		}

		return $newly_added_task_providers;
	}


	/**
	 * Get the newly added task providers.
	 *
	 * @return array
	 */
	public function get_newly_added_task_providers() {

		$task_provider_ids = $this->get_newly_added_task_provider_ids();

		$task_providers = [];

		foreach ( $task_provider_ids as $task_provider_id ) {
			$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $task_provider_id ); // @phpstan-ignore-line method.nonObject
			if ( $task_provider ) { // @phpstan-ignore-line
				$task_providers[] = $task_provider;
			}
		}

		return $task_providers;
	}
}
