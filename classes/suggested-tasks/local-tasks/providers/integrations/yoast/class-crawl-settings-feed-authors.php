<?php
/**
 * Add task for Yoast SEO: Remove post authors feeds.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;

/**
 * Add task for Yoast SEO: Remove post authors feeds.
 */
class Crawl_Settings_Feed_Authors extends Yoast_Provider {

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
	protected const PROVIDER_ID = 'yoast-crawl-settings-feed-authors';

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
		$this->url            = \admin_url( 'admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_feed_authors' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Yoast SEO: Remove post authors feeds', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Remove URLs which provide information about recent posts by specific authors. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-crawl-optimization-feed-authors" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [
			'iconElement'  => '.yst-toggle-field__header',
			'valueElement' => [
				'elementSelector' => 'button[data-id="input-wpseo-remove_feed_authors"]',
				'attributeName'   => 'aria-checked',
				'attributeValue'  => 'true',
				'operator'        => '=',
			],
		];
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// If there is more than one author, we don't need to add the task.
		if ( $this->data_collector->collect() > self::MINIMUM_AUTHOR_WITH_POSTS ) {
			return false;
		}

		$yoast_options = \WPSEO_Options::get_instance()->get_all();
		foreach ( [ 'remove_feed_authors' ] as $option ) {
			// If the crawl settings are already optimized, we don't need to add the task.
			if ( $yoast_options[ $option ] ) {
				return false;
			}
		}

		return true;
	}
}
