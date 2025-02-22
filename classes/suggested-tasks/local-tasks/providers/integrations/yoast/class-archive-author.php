<?php
/**
 * Add task for Yoast SEO: disable the author archive.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: disable the author archive.
 */
class Archive_Author extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'yoast-author-archive';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title       = \esc_html__( 'Yoast SEO: disable the author archive', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/author-archives' );
		$this->description = \esc_html__( 'Yoast SEO can disable the author archive when you have only one author, as it is the same as the homepage.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-author-archive" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		global $wpdb;

		// If the author archive is already disabled, we don't need to add the task.
		if ( YoastSEO()->helpers->options->get( 'disable-author' ) !== true ) {
			return true;
		}

		// If there is more than one author, we don't need to add the task.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$author_count = $wpdb->get_var( "SELECT COUNT(DISTINCT post_author) FROM {$wpdb->posts} WHERE post_status = 'publish' AND post_type = 'post'" );
		if ( $author_count > 1 ) {
			return true;
		}

		return false;
	}
}
