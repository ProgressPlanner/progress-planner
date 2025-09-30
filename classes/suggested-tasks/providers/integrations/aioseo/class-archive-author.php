<?php
/**
 * Add task for All in One SEO: disable the author archive.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;

/**
 * Add task for All in One SEO: disable the author archive.
 */
class Archive_Author extends AIOSEO_Provider {

	/**
	 * The minimum number of posts with a post format to add the task.
	 *
	 * @var int
	 */
	protected const MINIMUM_AUTHOR_WITH_POSTS = 1;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-author-archive';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Post_Author::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-author-archive';

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
		return \esc_html__( 'All in One SEO: disable the author archive', 'progress-planner' );
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

		// Check if task is still relevant (site has 1 or fewer authors).
		if ( ! $this->is_task_relevant() ) {
			return false;
		}

		// Check if author archives are already disabled in AIOSEO.
		$options = \aioseo()->options->searchAppearance->archives;

		// Check if author archives show in search results is set to false.
		if ( isset( $options->author->show ) && false === $options->author->show ) {
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
		// If there is more than one author, we don't need to add the task.
		return $this->get_data_collector()->collect() <= self::MINIMUM_AUTHOR_WITH_POSTS;
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
