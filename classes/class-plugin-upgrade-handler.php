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
	private $onboard_task_provider_ids = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Delay the init action to allow so the onboarding task providers are initialized.
		\add_action( 'init', [ $this, 'init' ], 20 );
	}

	/**
	 * Initialize the plugin upgrade handler.
	 * We want it only to run on the Progress Planner page in the admin (not on WP Dashboard or any other page) so we can properly display the onboarding tasks.
	 *
	 * @return void
	 */
	public function init() {

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We're not processing any data.
		if ( ! \is_admin() || ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'progress-planner' ) ) {
			return;
		}

		// Add the onboarding task providers.
		$this->onboard_task_provider_ids = apply_filters( 'prpl_onboarding_task_providers', $this->onboard_task_provider_ids );
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

			foreach ( $this->onboard_task_provider_ids as $task_provider_id ) {
				if ( ! in_array( $task_provider_id, $old_task_providers, true ) ) {
					$newly_added_task_providers[] = $task_provider_id;
				}
			}

			// Update 'progress_planner_previous_version_task_providers' option.
			\update_option( 'progress_planner_previous_version_task_providers', $this->onboard_task_provider_ids );
		}

		return $newly_added_task_providers;
	}


	/**
	 * Get the newly added task providers.
	 *
	 * @return array
	 */
	public function get_newly_added_task_providers() {
		static $newly_added_task_providers;

		if ( null === $newly_added_task_providers ) {
			$task_provider_ids = $this->get_newly_added_task_provider_ids();

			$task_providers = [];

			foreach ( $task_provider_ids as $task_provider_id ) {
				$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $task_provider_id ); // @phpstan-ignore-line method.nonObject
				if ( $task_provider ) { // @phpstan-ignore-line
					$task_providers[] = $task_provider;
				}
			}

				$newly_added_task_providers = $task_providers;
		}

		return $newly_added_task_providers;
	}
}
