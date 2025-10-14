<?php
/**
 * Add task for Yoast SEO: set your organization logo.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

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
		$this->yoast_seo = \YoastSEO();
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' // @phpstan-ignore-line property.nonObject
			? \esc_html__( 'Yoast SEO: set your organization logo', 'progress-planner' )
			: \esc_html__( 'Yoast SEO: set your person logo', 'progress-planner' );
	}

	/**
	 * Get external link URL.
	 *
	 * @return string
	 */
	public function get_external_link_url() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' // @phpstan-ignore-line property.nonObject
			? \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-person-logo' )
			: \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-organization-logo' );
	}

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [
			[
				'iconElement'  => 'legend.yst-label',
				'valueElement' => [
					'elementSelector' => 'input[name="wpseo_titles.company_logo"]',
					'attributeName'   => 'value',
					'attributeValue'  => '',
					'operator'        => '!=',
				],
			],
			[
				'iconElement'  => 'legend.yst-label',
				'valueElement' => [
					'elementSelector' => 'input[name="wpseo_titles.person_logo"]',
					'attributeName'   => 'value',
					'attributeValue'  => '',
					'operator'        => '!=',
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

		// Check if the site logo is set, Yoast SEO uses it as a fallback.
		$site_logo_id = \get_option( 'site_logo' );
		if ( ! $site_logo_id ) {
			$site_logo_id = \get_theme_mod( 'custom_logo', false );
		}

		// If the site logo is set, we don't need to add the task.
		if ( (int) $site_logo_id ) {
			return false;
		}

		// If the site is for a person, and the person logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'company' // @phpstan-ignore-line property.nonObject
			&& $this->yoast_seo->helpers->options->get( 'company_logo' ) // @phpstan-ignore-line property.nonObject
		) {
			return false;
		}

		// If the site is for a person, and the organization logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'person' // @phpstan-ignore-line property.nonObject
			&& $this->yoast_seo->helpers->options->get( 'person_logo' ) // @phpstan-ignore-line property.nonObject
		) {
			return false;
		}

		return true;
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$actions[] = [
			'priority' => 10,
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' ) . '" target="_self">' . \esc_html__( 'Set logo', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
