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
	 * Check if the task condition is satisfied.
	 *
	 * @return bool
	 */
	public function task_check() {
		if ( YoastSEO()->helpers->options->get( 'disable-post_format' ) === true ) {
			return false;
		}

		return true;
	}
}
