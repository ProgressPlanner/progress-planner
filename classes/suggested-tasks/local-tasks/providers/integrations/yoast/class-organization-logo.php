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
	 * Yoast SEO instance.
	 *
	 * @var \YoastSEO
	 */
	protected $yoast_seo;

	/**
	 * The company or person.
	 *
	 * @var string
	 */
	protected $company_or_person;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->yoast_seo         = YoastSEO();
		$this->company_or_person = $this->yoast_seo->helpers->options->get( 'company_or_person', '' );

		if ( $this->company_or_person !== 'person' ) {
			$this->title       = \esc_html__( 'Yoast SEO: set your organization logo', 'progress-planner' );
			$this->description = \esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your organization logo in the Yoast SEO settings.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-organization-logo" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
		} else {
			$this->title       = \esc_html__( 'Yoast SEO: set your person logo', 'progress-planner' );
			$this->description = \esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your person logo in the Yoast SEO settings.', 'progress-planner' ) .
			'<a href="https://prpl.fyi/yoast-organization-logo" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
		}

		$this->url = admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' );
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {

		// If the site is for a person, and the person logo is already set, we don't need to add the task.
		if ( $this->company_or_person === 'company' && $this->yoast_seo->helpers->options->get( 'company_logo' ) ) {
			return false;
		}

		// If the site is for a person, and the organization logo is already set, we don't need to add the task.
		if ( $this->company_or_person === 'person' && $this->yoast_seo->helpers->options->get( 'person_logo' ) ) {
			return false;
		}

		return true;
	}
}
