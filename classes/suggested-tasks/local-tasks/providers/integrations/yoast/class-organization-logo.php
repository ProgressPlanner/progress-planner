<?php
/**
 * Add task for Yoast SEO: set your organization logo.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: set your organization logo.
 */
class Organization_Logo extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'yoast-organization-logo';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title       = \esc_html__( 'Yoast SEO: set your organization logo', 'progress-planner' );
		$this->url         = admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' );
		$this->description = \esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your Organization Logo in the Yoast SEO settings.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-organization-logo" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Check if the task condition is satisfied.
	 *
	 * @return bool
	 */
	public function task_check() {
		if ( YoastSEO()->helpers->options->get( 'company_logo' ) ) {
			return false;
		}

		return true;
	}
}
