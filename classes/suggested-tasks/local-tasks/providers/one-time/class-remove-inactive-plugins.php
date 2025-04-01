<?php
/**
 * Add tasks to remove inactive plugins.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;
use Progress_Planner\Data_Collector\Inactive_Plugins as Inactive_Plugins_Data_Collector;

/**
 * Add tasks to remove inactive plugins.
 */
class Remove_Inactive_Plugins extends One_Time {

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
	 * The data collector.
	 *
	 * @var \Progress_Planner\Data_Collector\Inactive_Plugins
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Inactive_Plugins_Data_Collector();

		$this->url         = \admin_url( 'plugins.php' );
		$this->title       = \esc_html__( 'Remove inactive plugins', 'progress-planner' );
		$this->description = sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/remove-inactive-plugins" target="_blank">removing any plugins</a> link */
			\esc_html__( 'You have inactive plugins. Consider %1$s that are not activated to free up resources, and improve security.', 'progress-planner' ),
			'<a href="https://prpl.fyi/remove-inactive-plugins" target="_blank">' . \esc_html__( 'removing any plugins', 'progress-planner' ) . '</a>',
		);
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return $this->data_collector->collect() > 0;
	}
}
