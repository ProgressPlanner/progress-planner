<?php
/**
 * Add task for Yoast SEO: Remove global comment feeds.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: Remove global comment feeds.
 */
class Crawl_Settings_Feed_Global_Comments extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-crawl-settings-feed-global-comments';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url = \admin_url( 'admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_feed_global_comments' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Yoast SEO: Remove global comment feeds', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Remove URLs which provide an overview of recent comments on your site. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-crawl-optimization-feed-global-comments" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
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
					'elementSelector' => 'button[data-id="input-wpseo-remove_feed_global_comments"]',
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
		$yoast_options = \WPSEO_Options::get_instance()->get_all();
		foreach ( [ 'remove_feed_global_comments' ] as $option ) {
			// If the crawl settings are already optimized, we don't need to add the task.
			if ( $yoast_options[ $option ] ) {
				return false;
			}
		}

		return true;
	}
}
