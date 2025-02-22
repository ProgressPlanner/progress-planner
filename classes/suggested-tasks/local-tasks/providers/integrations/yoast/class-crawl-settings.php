<?php
/**
 * Add task for Yoast SEO: optimize your crawl settings.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: optimize your crawl settings.
 */
class Crawl_Settings extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'yoast-crawl-settings';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title       = \esc_html__( 'Yoast SEO: optimize your crawl settings', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/crawl-optimization' );
		$this->description = \esc_html__( 'Yoast SEO can block search engines from crawling unnecessary pages.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-crawl-optimization" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * If the crawl settings are already optimized, we don't need to add the task.
	 *
	 * @return bool
	 */
	public function task_check() {
		if ( YoastSEO()->helpers->options->get( 'remove_rsd_wlw_links' ) ||
			YoastSEO()->helpers->options->get( 'remove_rest_api_links' ) ||
			YoastSEO()->helpers->options->get( 'remove_feed_post_comments' ) ||
			YoastSEO()->helpers->options->get( 'remove_feed_tags' )
			) {
			return false;
		}

		return true;
	}
}
