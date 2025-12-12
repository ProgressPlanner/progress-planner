<?php
/**
 * Add task to install and activate an SEO plugin.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\SEO_Plugin as SEO_Plugin_Data_Collector;

/**
 * Add task to install and activate an SEO plugin.
 */
class SEO_Plugin extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'seo-plugin';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'seo-plugin';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = SEO_Plugin_Data_Collector::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/install-seo-plugin';

	/**
	 * The priority of the task.
	 *
	 * @var int
	 */
	protected $priority = 20;

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'plugins.php' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Install an SEO plugin', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Only add the task if no SEO plugin is detected.
		return ! $this->get_data_collector()->collect();
	}

	/**
	 * Check if the task is completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		// Task is completed if an SEO plugin is detected.
		return $this->get_data_collector()->collect();
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	// Popover rendering methods removed - now handled by React CustomPopover component.

	/**
	 * Get plugin name from the data collector by slug.
	 *
	 * @param string $slug The plugin slug.
	 *
	 * @return string|null Plugin name or null if not found.
	 */
	public function get_plugin_name_by_slug( $slug ) {
		$data_collector = $this->get_data_collector();
		if ( ! $data_collector instanceof SEO_Plugin_Data_Collector ) {
			return null;
		}

		$seo_plugins = $data_collector->get_seo_plugins();
		if ( ! isset( $seo_plugins[ $slug ]['name'] ) ) {
			return null;
		}

		return $seo_plugins[ $slug ]['name'];
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$actions[] = [
			'priority' => 10,
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Install plugin', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
