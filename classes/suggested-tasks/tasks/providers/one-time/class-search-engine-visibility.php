<?php
/**
 * Add task to allow search engines to index the site.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Tasks\Providers\One_Time;

/**
 * Add task to allow search engines to index the site.
 */
class Search_Engine_Visibility extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'search-engine-visibility';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url          = \admin_url( 'options-reading.php' );
		$this->link_setting = [
			'hook'   => 'options-reading.php',
			'iconEl' => 'label[for="blog_public"]',
		];
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Allow your site to be indexed by search engines', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/blog-indexing-settings" target="_blank">allowing search engines</a> link */
			\esc_html__( 'Your site is not currently visible to search engines. Consider %1$s to index your site.', 'progress-planner' ),
			'<a href="https://prpl.fyi/blog-indexing-settings" target="_blank">' . \esc_html__( 'allowing search engines', 'progress-planner' ) . '</a>',
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
