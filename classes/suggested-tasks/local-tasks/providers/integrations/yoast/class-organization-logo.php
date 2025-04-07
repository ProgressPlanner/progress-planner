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
	protected const PROVIDER_ID = 'yoast-organization-logo';

	/**
	 * Yoast SEO instance.
	 *
	 * @var \YoastSEO
	 */
	protected $yoast_seo;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->yoast_seo = YoastSEO();
		$this->url       = admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person'
			? \esc_html__( 'Yoast SEO: set your organization logo', 'progress-planner' )
			: \esc_html__( 'Yoast SEO: set your person logo', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person'
			? \esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your organization logo in the Yoast SEO settings.', 'progress-planner' ) .
			' <a href="https://prpl.fyi/yoast-person-logo" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.'
			: \esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your person logo in the Yoast SEO settings.', 'progress-planner' ) .
			' <a href="https://prpl.fyi/yoast-organization-logo" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>.';
	}

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [
			'iconElement'  => 'legend.yst-label',
			'valueElement' => [
				'elementSelector' => $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' ? 'input[name="wpseo_titles.company_logo_id"]' : 'input[name="wpseo_titles.person_logo_id"]',
				'attributeName'   => 'value',
				'attributeValue'  => '0',
				'operator'        => '!=',
			],
		];
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {

		// If the site is for a person, and the person logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'company' && $this->yoast_seo->helpers->options->get( 'company_logo' ) ) {
			return false;
		}

		// If the site is for a person, and the organization logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'person' && $this->yoast_seo->helpers->options->get( 'person_logo' ) ) {
			return false;
		}

		return true;
	}
}
