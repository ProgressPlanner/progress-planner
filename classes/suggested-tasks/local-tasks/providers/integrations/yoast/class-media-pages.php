<?php
/**
 * Add task for Yoast SEO: disable the media pages.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: disable the media pages.
 */
class Media_Pages extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'yoast-media-pages';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title       = \esc_html__( 'Yoast SEO: disable the media pages', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/media-pages' );
		$this->description = \esc_html__( 'Yoast SEO can disable the media / attachment pages, which are the pages that show the media files. You really don\'t need them, except when you are displaying photos or art on your site through them.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-media-pages" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// If the media pages are already disabled, we don't need to add the task.
		return ( YoastSEO()->helpers->options->get( 'disable-attachment' ) !== true );
	}
}
