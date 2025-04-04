<?php
/**
 * Add task for Yoast SEO: disable the format archives.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format as Archive_Format_Data_Collector;

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
	 * The minimum number of posts with a post format to add the task.
	 *
	 * @var int
	 */
	protected const MINIMUM_POSTS_WITH_FORMAT = 3;

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Archive_Format_Data_Collector();

		$this->title       = \esc_html__( 'Yoast SEO: disable the format archives', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/format-archives' );
		$this->description = \esc_html__( 'WordPress creates an archive for each post format. This is not useful and can be disabled in the Yoast SEO settings.', 'progress-planner' ) .
			' <a href="https://prpl.fyi/yoast-format-archive" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$archive_format_count = $this->data_collector->collect();

		// If there are more than X posts with a post format, we don't need to add the task. X is set in the class.
		if ( $archive_format_count > static::MINIMUM_POSTS_WITH_FORMAT ) {
			return false;
		}

		// If the post format archive is already disabled, we don't need to add the task.
		if ( YoastSEO()->helpers->options->get( 'disable-post_format' ) === true ) {
			return false;
		}

		return true;
	}
}
