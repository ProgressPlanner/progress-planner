<?php
/**
 * Handle plugin onboarding and upgrade task related functionality.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Plugin_Upgrade_Tasks class.
 */
class Plugin_Upgrade_Tasks {

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Plugin (possibly 3rd party) activated.
		\add_action( 'activated_plugin', [ $this, 'plugin_activated_or_updated' ], 10 );

		// Progress Planner plugin updated.
		\add_action( 'progress_planner_plugin_updated', [ $this, 'plugin_activated_or_updated' ], 10 );

		// Check if the plugin was upgraded or new plugin was activated.
		\add_action( 'init', [ $this, 'handle_activation_or_upgrade' ], 100 ); // We need to run this after the Tasks_Manager::init() is called.
	}

	/**
	 * Plugin upgraded or (3rd party) plugin was activated.
	 *
	 * @return void
	 */
	public function plugin_activated_or_updated() {
		update_option( 'progress_planner_plugin_was_activated', true );
	}

	/**
	 * If the plugin was upgraded or new plugin was activated, check if we need to add onboarding tasks.
	 *
	 * @return void
	 */
	public function handle_activation_or_upgrade() {
		if ( ! \get_option( 'progress_planner_plugin_was_activated', false ) ) {
			return;
		}

		\delete_option( 'progress_planner_plugin_was_activated' );

		$this->maybe_add_onboarding_tasks();
	}

	/**
	 * Add onboarding tasks.
	 *
	 * @return void
	 */
	public function maybe_add_onboarding_tasks() {
		$onboard_task_provider_ids = apply_filters( 'prpl_onboarding_task_providers', [] );

		// Privacy policy is not accepted, so it's a fresh install.
		$fresh_install = ! \progress_planner()->is_privacy_policy_accepted();

		// Check if task providers option exists, it will not on fresh installs and v1.0.4 and older.
		$old_task_providers = \get_option( 'progress_planner_previous_version_task_providers', [] );

		// We're upgrading from v1.0.4 or older, set the old task providers to what we had before the upgrade.
		if ( ! $fresh_install && empty( $old_task_providers ) ) {
			$old_task_providers = [
				'core-blogdescription',
				'wp-debug-display',
				'sample-page',
				'hello-world',
				'core-siteicon',
			];
		}

		$newly_added_task_provider_ids = \get_option( 'progress_planner_upgrade_popover_task_provider_ids', [] );

		foreach ( $onboard_task_provider_ids as $task_provider_id ) {
			if ( ! empty( $task_provider_id ) && ! in_array( $task_provider_id, $old_task_providers, true ) && ! in_array( $task_provider_id, $newly_added_task_provider_ids, true ) ) {
				$newly_added_task_provider_ids[] = $task_provider_id;
			}
		}

		// Update 'progress_planner_previous_version_task_providers' option.
		\update_option( 'progress_planner_previous_version_task_providers', array_unique( array_merge( $old_task_providers, $onboard_task_provider_ids ), SORT_REGULAR ) );

		// Update 'progress_planner_upgrade_popover_task_providers' option.
		\update_option( 'progress_planner_upgrade_popover_task_provider_ids', $newly_added_task_provider_ids );
	}

	/**
	 * Get the newly added task providers.
	 *
	 * @return array
	 */
	public function get_newly_added_task_providers() {
		static $newly_added_task_providers;

		if ( ! $this->should_show_upgrade_popover() ) {
			return [];
		}

		if ( null === $newly_added_task_providers ) {
			$task_provider_ids = $this->get_upgrade_popover_task_provider_ids();

			$task_providers = [];

			foreach ( $task_provider_ids as $task_provider_id ) {
				$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_provider_id ); // @phpstan-ignore-line method.nonObject
				if ( $task_provider ) { // @phpstan-ignore-line
					$task_providers[] = $task_provider;
				}
			}

			$newly_added_task_providers = $task_providers;
		}

		return $newly_added_task_providers;
	}

	/**
	 * Check if we should show the upgrade popover.
	 *
	 * @return bool
	 */
	public function should_show_upgrade_popover() {
		return \progress_planner()->is_on_progress_planner_dashboard_page() && ! empty( $this->get_upgrade_popover_task_provider_ids() );
	}

	/**
	 * Get the upgrade popover task provider IDs.
	 *
	 * @return array
	 */
	public function get_upgrade_popover_task_provider_ids() {
		return \get_option( 'progress_planner_upgrade_popover_task_provider_ids', [] );
	}

	/**
	 * Delete the upgrade popover task providers, for example after they've been shown.
	 *
	 * @return void
	 */
	public function delete_upgrade_popover_task_providers() {
		\delete_option( 'progress_planner_upgrade_popover_task_provider_ids' );
	}
}
