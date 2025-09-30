<?php
/**
 * Add task for All in One SEO: disable global comment RSS feeds.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add task for All in One SEO: disable global comment RSS feeds.
 */
class Crawl_Settings_Feed_Global_Comments extends AIOSEO_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-crawl-settings-feed-global-comments';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-crawl-optimization-feed-global-comments';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/advanced' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: disable global comment RSS feeds', 'progress-planner' );
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

		// Check if crawl cleanup is enabled and comment feeds are disabled.
		$options = \aioseo()->options->searchAppearance->advanced;

		// First check if crawl cleanup is enabled.
		if ( ! isset( $options->crawlCleanup ) || false === $options->crawlCleanup ) {
			// If crawl cleanup is not enabled, this task is not yet applicable.
			return false;
		}

		// Check if comment feeds are already disabled.
		if ( isset( $options->feeds ) && isset( $options->feeds->comments ) && false === $options->feeds->comments ) {
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
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=aioseo-search-appearance#/advanced' ) . '" target="_self">' . \esc_html__( 'Disable', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
