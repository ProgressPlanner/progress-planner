<?php
/**
 * Add task for Yoast SEO: disable the date archive.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: disable the date archive.
 */
class Archive_Date extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'yoast-date-archive';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title       = \esc_html__( 'Yoast SEO: disable the date archive', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/date-archives' );
		$this->description = \esc_html__( 'Yoast SEO can disable the date archive, which is really only useful for news sites and blogs.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-date-archive" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * If the date archive is already disabled, we don't need to add the task and/or the task is completed.
	 *
	 * @return bool
	 */
	public function task_check() {
		return ( YoastSEO()->helpers->options->get( 'disable-date' ) !== true );
	}
}
