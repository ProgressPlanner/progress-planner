<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Reduce_Autoloaded_Options extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'reduce-autoloaded-options';

	/**
	 * The number of autoloaded options.
	 *
	 * @var int
	 */
	private $autoloaded_options_count = null;


	/**
	 * The plugin active state.
	 *
	 * @var bool
	 */
	private $is_plugin_active = null;

	/**
	 * Threshold for the number of autoloaded options.
	 *
	 * @var int
	 */
	private $autoloaded_options_threshold = 10; // TODO: 10 is just for testing purposes.

	/**
	 * The plugin path.
	 *
	 * @var string
	 */
	private $plugin_path = 'aaa-option-optimizer/aaa-option-optimizer.php';

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// If the plugin is  active, we don't need to add the task.
		if ( $this->is_plugin_active() ) {
			return false;
		}

		return $this->get_autoloaded_options_count() > $this->autoloaded_options_threshold;
	}

	/**
	 * Check if the task is completed.
	 *
	 * @return bool
	 */
	public function is_task_completed() {
		return $this->is_plugin_active() || $this->get_autoloaded_options_count() <= $this->autoloaded_options_threshold;
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
			'title'       => \esc_html__( 'Reduce number of autoloaded options', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'medium',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( '/plugin-install.php?tab=search&s=aaa+option+optimizer' ) ) : '',
			'dismissable' => true,
			'description' => '<p>' . sprintf(
				// translators: %d is the number of autoloaded options.
				\esc_html__( 'There are %d autoloaded options. If you don\'t need them, consider disabling them by installing the "AAA Option Optimizer" plugin.', 'progress-planner' ),
				$this->get_autoloaded_options_count(),
			) . '</p>',
		];
	}

	/**
	 * Check if the plugin is active.
	 *
	 * @return bool
	 */
	protected function is_plugin_active() {

		if ( null === $this->is_plugin_active ) {
			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore requireOnce.fileNotFound
			}

			$plugins                = get_plugins();
			$this->is_plugin_active = isset( $plugins[ $this->plugin_path ] ) && is_plugin_active( $this->plugin_path );
		}

		return $this->is_plugin_active;
	}

	/**
	 * Get the number of autoloaded options.
	 *
	 * @return int
	 */
	protected function get_autoloaded_options_count() {
		global $wpdb;

		if ( null === $this->autoloaded_options_count ) {
			$this->autoloaded_options_count = $wpdb->get_var( "SELECT COUNT(*) FROM `{$wpdb->options}` WHERE ( autoload = 'yes' OR autoload = 'on' )" );
		}

		return $this->autoloaded_options_count;
	}
}
