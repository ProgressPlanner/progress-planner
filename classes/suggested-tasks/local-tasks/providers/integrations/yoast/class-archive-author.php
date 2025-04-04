<?php
/**
 * Add task for Yoast SEO: disable the author archive.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;

/**
 * Add task for Yoast SEO: disable the author archive.
 */
class Archive_Author extends Yoast_Provider {

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
	protected const ID = 'yoast-author-archive';

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Post_Author();

		$this->title       = \esc_html__( 'Yoast SEO: disable the author archive', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/author-archives' );
		$this->description = \esc_html__( 'Yoast SEO can disable the author archive when you have only one author, as it is the same as the homepage.', 'progress-planner' ) .
			' <a href="https://prpl.fyi/yoast-author-archive" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// If the author archive is already disabled, we don't need to add the task.
		if ( YoastSEO()->helpers->options->get( 'disable-author' ) === true ) {
			return false;
		}

		// If there is more than one author, we don't need to add the task.
		if ( $this->data_collector->collect() > self::MINIMUM_AUTHOR_WITH_POSTS ) {
			return false;
		}

		return true;
	}
}
