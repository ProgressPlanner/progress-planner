<?php
/**
 * Add task for Yoast SEO: Remove post authors feeds.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

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
		return \esc_html__( 'Yoast SEO: remove post authors feeds', 'progress-planner' );
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
			'<a href="https://prpl.fyi/yoast-crawl-optimization-feed-authors" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the Yoast SEO Crawl Optimization Feed Authors', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [
			[
				'iconElement'  => '.yst-toggle-field__header',
				'valueElement' => [
					'elementSelector' => 'button[data-id="input-wpseo-remove_feed_authors"]',
					'attributeName'   => 'aria-checked',
					'attributeValue'  => 'true',
					'operator'        => '=',
				],
			],
		];
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {

		if ( ! $this->is_task_relevant() ) {
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

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		// If there is more than one author, we don't need to add the task.
		if ( $this->data_collector->collect() > self::MINIMUM_AUTHOR_WITH_POSTS ) {
			return false;
		}

		return true;
	}
}
