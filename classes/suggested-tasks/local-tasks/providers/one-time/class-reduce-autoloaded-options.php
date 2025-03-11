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
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const CATEGORY = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const PROVIDER_ID = 'reduce-autoloaded-options';

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
	 * Constructor.
	 */
	public function __construct() {

		$this->title       = \esc_html__( 'Reduce number of autoloaded options', 'progress-planner' );
		$this->description = sprintf(
			// translators: %d is the number of autoloaded options.
			\esc_html__( 'There are %d autoloaded options. If you don\'t need them, consider disabling them by installing the "AAA Option Optimizer" plugin.', 'progress-planner' ),
			$this->get_autoloaded_options_count(),
		);
		$this->url            = \admin_url( '/plugin-install.php?tab=search&s=aaa+option+optimizer' );
		$this->is_dismissable = true;
	}

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
			$autoload_values = \wp_autoload_values_to_autoload();
			$placeholders    = implode( ',', array_fill( 0, count( $autoload_values ), '%s' ) );

			// phpcs:disable WordPress.DB
			$this->autoloaded_options_count = $wpdb->get_var(
				$wpdb->prepare( "SELECT COUNT(*) FROM `{$wpdb->options}` WHERE autoload IN ( $placeholders )", $autoload_values )
			);

		}

		return $this->autoloaded_options_count;
	}
}
