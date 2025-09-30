<?php
/**
 * Add task for All in One SEO: enable crawl cleanup.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add task for All in One SEO: enable crawl cleanup to optimize crawling.
 */
class Crawl_Settings_Emoji_Scripts extends AIOSEO_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-crawl-settings-emoji-scripts';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-crawl-optimization';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/advanced' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: enable crawl cleanup', 'progress-planner' );
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

		// Check if crawl cleanup is already enabled.
		$options = \aioseo()->options->searchAppearance->advanced;

		// Check if crawlCleanup is enabled.
		if ( isset( $options->crawlCleanup ) && true === $options->crawlCleanup ) {
			return false;
		}

		return true;
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
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=aioseo-search-appearance#/advanced' ) . '" target="_self">' . \esc_html__( 'Enable', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
