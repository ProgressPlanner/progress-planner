<?php
/**
 * Add task for Yoast SEO: disable the format archives.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: disable the format archives.
 */
class Archive_Format extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'yoast-format-archive';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title       = \esc_html__( 'Yoast SEO: disable the format archives', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/format-archives' );
		$this->description = \esc_html__( 'WordPress creates an archive for each post format. This is not useful and can be disabled in the Yoast SEO settings.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-format-archive" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Check if there are any posts that use a post format using get_posts and get only the IDs.
		// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		$args = [
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'tax_query'      => [
				[
					'taxonomy' => 'post_format',
					'operator' => 'EXISTS',
				],
			],
		];

		$posts_with_format_ids = get_posts( $args );
		// phpcs:enable WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		// If there are more than 3 posts with a post format, we don't need to add the task.
		if ( count( $posts_with_format_ids ) > 3 ) {
			return false;
		}

		// If the post format archive is already disabled, we don't need to add the task.
		if ( YoastSEO()->helpers->options->get( 'disable-post_format' ) === true ) {
			return false;
		}

		return true;
	}
}
