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
			' <a href="https://prpl.fyi/yoast-crawl-optimization" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$yoast_options = \WPSEO_Options::get_instance()->get_all();
		foreach ( [
			'remove_feed_global',
			'remove_feed_global_comments',
			'remove_feed_post_comments',
			'remove_feed_authors',
			'remove_feed_categories',
			'remove_feed_tags',
			'remove_feed_custom_taxonomies',
			'remove_feed_post_types',
			'remove_feed_search',
			'remove_atom_rdf_feeds',
			'remove_shortlinks',
			'remove_rest_api_links',
			'remove_rsd_wlw_links',
			'remove_oembed_links',
			'remove_generator',
			'remove_emoji_scripts',
			'remove_powered_by_header',
			'remove_pingback_header',
			'clean_campaign_tracking_urls',
			'clean_permalinks',
			'search_cleanup',
			'search_cleanup_emoji',
			'search_cleanup_patterns',
		] as $option ) {
			// If the crawl settings are already optimized, we don't need to add the task.
			if ( $yoast_options[ $option ] ) {
				return false;
			}
		}

		return true;
	}
}
