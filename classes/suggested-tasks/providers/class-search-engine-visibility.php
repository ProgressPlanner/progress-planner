<?php
/**
 * Add task to allow search engines to index the site.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task to allow search engines to index the site.
 */
class Search_Engine_Visibility extends Tasks {

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
	protected const PROVIDER_ID = 'search-engine-visibility';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-reading.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-reading.php',
			'iconEl' => 'label[for="blog_public"]',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Allow your site to be indexed by search engines', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/blog-indexing-settings" target="_blank">allowing search engines</a> link */
			\esc_html__( 'Your site is not currently visible to search engines. Consider %1$s to index your site.', 'progress-planner' ),
			'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/blog-indexing-settings' ) ) . '" target="_blank">' . \esc_html__( 'allowing search engines', 'progress-planner' ) . '</a>',
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 === (int) \get_option( 'blog_public' );
	}
}
