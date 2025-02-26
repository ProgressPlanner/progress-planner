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

		// Add the action to add the upgrade tasks popover.
		\add_action( 'progress_planner_admin_page_after_widgets', [ $this, 'add_upgrade_tasks_popover' ] );
	}

	/**
	 * Initialize the plugin upgrade handler.
	 * We want it only to run on the Progress Planner page in the admin (not on WP Dashboard or any other page) so we can properly display the onboarding tasks.
	 *
	 * @return void
	 */
	public function init() {
		if ( ! $this->is_on_progress_planner_page() ) {
			return;
		}

		// Add the onboarding task providers.
		$this->onboard_task_provider_ids = apply_filters( 'prpl_onboarding_task_providers', $this->onboard_task_provider_ids );
	}

	/**
	 * Add the upgrade tasks popover.
	 *
	 * @return void
	 */
	public function add_upgrade_tasks_popover() {

		if ( $this->get_newly_added_task_providers() ) {
			\progress_planner()->get_popover()->the_popover( 'upgrade-tasks' )->render();
		}
	}

	/**
	 * Get the IDs of the newly added task providers.
	 *
	 * @return array
	 */
	protected function get_newly_added_task_provider_ids() {
		static $newly_added_task_providers;

		if ( null === $newly_added_task_providers ) {

			// Privacy policy is not accepted, so it's a fresh install.
			$fresh_install = ! \progress_planner()->is_privacy_policy_accepted();

			// Check if task providers option exists, it will not on fresh installs and v1.0.4 and older.
			$old_task_providers = \get_option( 'progress_planner_previous_version_task_providers', [] );

			// We're upgrading from v1.0.4 and older, set the old task providers to what we had before the upgrade.
			if ( ! $fresh_install && empty( $old_task_providers ) ) {
				$old_task_providers = [
					'core-blogdescription',
					'wp-debug-display',
					'sample-page',
					'hello-world',
					'core-siteicon',
				];
			}

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

		if ( ! $this->is_on_progress_planner_page() ) {
			return [];
		}

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

	/**
	 * Check if we're on the Progress Planner page.
	 *
	 * @return bool
	 */
	protected function is_on_progress_planner_page() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We're not processing any data.
		return \is_admin() && isset( $_GET['page'] ) && $_GET['page'] === 'progress-planner';
	}
}
