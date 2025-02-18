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
	 * Get the added task providers.
	 *
	 * @return array
	 */
	public function get_added_task_providers() {

		// Whitelist the task provider ids that should be shown to user during onboarding.
		$whitelisted_task_providers = apply_filters(
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

		$old_task_providers = \get_option( 'progress_planner_task_providers', [] );

		$added_task_providers = [];

		foreach ( $whitelisted_task_providers as $task_provider_id ) {
			if ( ! in_array( $task_provider_id, $old_task_providers, true ) ) {
				$added_task_providers[] = $task_provider_id;
			}
		}

		// TODO: Update 'progress_planner_task_providers' option. That is done on upgrade.

		return $added_task_providers;
	}


	/**
	 * Get the newly added task providers.
	 *
	 * @return array
	 */
	public function get_onboarding_task_providers() {

		$task_provider_ids = $this->get_added_task_providers();

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
