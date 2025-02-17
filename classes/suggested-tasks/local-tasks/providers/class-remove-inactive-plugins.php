<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Remove_Inactive_Plugins extends Local_OneTime_Tasks_Abstract {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'remove-inactive-plugins';

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		$plugins        = get_plugins();
		$plugins_active = 0;
		$plugins_total  = 0;

		// Loop over the available plugins and check their versions and active state.
		foreach ( array_keys( $plugins ) as $plugin_path ) {
			++$plugins_total;

			if ( is_plugin_active( $plugin_path ) ) {
				++$plugins_active;
			}
		}

		$unused_plugins = 0;
		if ( ! is_multisite() && $plugins_total > $plugins_active ) {
			$unused_plugins = $plugins_total - $plugins_active;
		}

		return $unused_plugins > 0;
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		if ( ! $task_id ) {
			$task_id = $this->get_provider_id();
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Remove inactive plugins', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => '',
			'dismissible' => true,
			'description' => '<p>' . \esc_html__( 'You have inactive plugins. Consider removing any plugins that are not activated to free up resources, and improve security.', 'progress-planner' ) . '</p>',
		];
	}
}
