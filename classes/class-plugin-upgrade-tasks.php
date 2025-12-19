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
		\add_action( 'activated_plugin', [ $this, 'plugin_activated' ], 10 );

		// Progress Planner plugin updated.
		\add_action( 'progress_planner_plugin_updated', [ $this, 'plugin_updated' ], 10 );

		// Check if the plugin was upgraded or new plugin was activated.
		\add_action( 'init', [ $this, 'handle_activation_or_upgrade' ], 100 );

		// Add the action to add the upgrade tasks popover.
		\add_action( 'progress_planner_admin_page_after_widgets', [ $this, 'add_upgrade_tasks_popover' ] );
	}

	/**
	 * Plugin upgraded or (3rd party) plugin was activated.
	 *
	 * @param string $plugin The plugin file.
	 *
	 * @return void
	 */
	public function plugin_activated( $plugin ) {
		if ( 'progress-planner/progress-planner.php' !== $plugin ) {
			return;
		}

		\update_option( 'progress_planner_plugin_was_activated', true );
	}

	/**
	 * Plugin upgraded.
	 *
	 * @return void
	 */
	public function plugin_updated() {
		\update_option( 'progress_planner_plugin_was_updated', true );
	}

	/**
	 * If the plugin was upgraded or new plugin was activated, check if we need to add onboarding tasks.
	 *
	 * @return void
	 */
	public function handle_activation_or_upgrade() {

		// Plugin was installed.
		if ( \get_option( 'progress_planner_plugin_was_activated', false ) ) {
			$this->add_initial_onboarding_tasks();

			\delete_option( 'progress_planner_plugin_was_activated' );
			return;
		}

		// Plugin was updated.
		if ( \get_option( 'progress_planner_plugin_was_updated', false ) ) {
			$this->maybe_add_onboarding_tasks();

			\delete_option( 'progress_planner_plugin_was_updated' );
			return;
		}
	}

	/**
	 * Add initial onboarding tasks.
	 *
	 * @return void
	 */
	protected function add_initial_onboarding_tasks() {
		// Privacy policy is not accepted, so it's a fresh install.
		$fresh_install = ! \progress_planner()->is_privacy_policy_accepted();

		// If this is the first time the plugin is installed, save the task providers.
		if ( $fresh_install ) {
			$onboard_task_provider_ids = \apply_filters( 'prpl_onboarding_task_providers', [] );

			// Update 'progress_planner_previous_version_task_providers' option.
			\update_option( 'progress_planner_previous_version_task_providers', \array_unique( $onboard_task_provider_ids ), SORT_REGULAR );
		}
	}

	/**
	 * Add onboarding tasks.
	 *
	 * @return void
	 */
	public function maybe_add_onboarding_tasks() {
		$onboard_task_provider_ids = \apply_filters( 'prpl_onboarding_task_providers', [] );

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
			if ( ! empty( $task_provider_id ) && ! \in_array( $task_provider_id, $old_task_providers, true ) && ! \in_array( $task_provider_id, $newly_added_task_provider_ids, true ) ) {
				$newly_added_task_provider_ids[] = $task_provider_id;
			}
		}

		// Update 'progress_planner_previous_version_task_providers' option.
		\update_option( 'progress_planner_previous_version_task_providers', \array_unique( \array_merge( $old_task_providers, $onboard_task_provider_ids ), SORT_REGULAR ) );

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

		// Task providers are now handled by React, so we don't have PHP provider objects.
		// Return empty array since upgrade popovers are no longer needed.
		return [];
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

	/**
	 * Add the upgrade tasks popover.
	 *
	 * @return void
	 */
	public function add_upgrade_tasks_popover() {
		if ( $this->should_show_upgrade_popover() ) {
			// Popover is now handled by React via PopoverManager.
			// Data is fetched via REST API when popover opens.
			// Trigger popover via WordPress hook after a short delay to ensure React is loaded.
			\add_action( 'admin_footer', [ $this, 'trigger_upgrade_tasks_popover' ], 999 );
		}
	}

	/**
	 * Trigger upgrade tasks popover via WordPress hook.
	 *
	 * @return void
	 */
	public function trigger_upgrade_tasks_popover() {
		// Delete upgrade popover task providers when popover is shown.
		// This matches the original PHP template behavior.
		$this->delete_upgrade_popover_task_providers();

		// Create a task object for the popover.
		$task = [
			'id'    => 'upgrade-tasks',
			'slug'  => 'upgrade-tasks',
			'title' => \__( "We've added new recommendations to the Progress Planner plugin", 'progress-planner' ),
		];

		// Trigger popover via WordPress hook.
		?>
		<script>
		( function() {
			if ( typeof wp !== 'undefined' && wp.hooks && wp.hooks.doAction ) {
				wp.hooks.doAction( 'prpl.popover.open', 'upgrade-tasks', <?php echo \wp_json_encode( $task ); ?> );
			}
		} )();
		</script>
		<?php
	}
}
