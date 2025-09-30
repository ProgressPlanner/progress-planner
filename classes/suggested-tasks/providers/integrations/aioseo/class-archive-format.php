<?php
/**
 * Add task for All in One SEO: disable the format archives.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

use Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format as Archive_Format_Data_Collector;

/**
 * Add task for All in One SEO: disable the format archives.
 */
class Archive_Format extends AIOSEO_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-format-archive';

	/**
	 * The minimum number of posts with a post format to add the task.
	 *
	 * @var int
	 */
	protected const MINIMUM_POSTS_WITH_FORMAT = 3;

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Archive_Format_Data_Collector::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-format-archive';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/archives' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: disable the format archives', 'progress-planner' );
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Check if AIOSEO is active.
		if ( ! \function_exists( 'aioseo' ) ) {
			return false;
		}

		// Check if task is still relevant.
		if ( ! $this->is_task_relevant() ) {
			return false;
		}

		// Note: AIOSEO may not have a specific "format archives" toggle.
		// This task will guide users to the Archives settings where they can manage post format taxonomies.
		// Check if post format archives are disabled via noindex or show setting.
		$options = \aioseo()->options->searchAppearance->archives;

		// Check if post format archive exists and is set to not show.
		if ( isset( $options->postFormat->show ) && false === $options->postFormat->show ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		// If there are more than X posts with a post format, we don't need to add the task. X is set in the class.
		return $this->get_data_collector()->collect() <= static::MINIMUM_POSTS_WITH_FORMAT;
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
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=aioseo-search-appearance#/archives' ) . '" target="_self">' . \esc_html__( 'Disable', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
