<?php
/**
 * Add tasks to remove inactive plugins.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Inactive_Plugins as Inactive_Plugins_Data_Collector;

/**
 * Add tasks to remove inactive plugins.
 */
class Remove_Inactive_Plugins extends Tasks {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'remove-inactive-plugins';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Inactive_Plugins_Data_Collector::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/remove-inactive-plugins';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'plugins.php' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Remove inactive plugins', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'You have inactive plugins. Consider removing any plugins that are not activated to free up resources, and improve security.', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return $this->get_data_collector()->collect() > 0;
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
			'priority' => 100,
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'plugins.php' ) . '" target="_self">' . \esc_html__( 'Go to the "Plugins" page', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
