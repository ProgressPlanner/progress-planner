<?php
/**
 * Add task for Yoast SEO: set your organization logo.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Task_Action_Builder;

/**
 * Add task for Yoast SEO: set your organization logo.
 */
class Organization_Logo extends Yoast_Interactive_Provider {

	use Task_Action_Builder;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-organization-logo';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'yoast-organization-logo';

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
		parent::__construct();
		$this->yoast_seo = \YoastSEO();
	}

	/**
	 * Check if the site is in person mode.
	 *
	 * @return bool
	 */
	protected function is_person_mode() {
		return 'person' === $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ); // @phpstan-ignore-line property.nonObject
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
		return $this->is_person_mode()
			? \esc_html__( 'Yoast SEO: set your person logo', 'progress-planner' )
			: \esc_html__( 'Yoast SEO: set your organization logo', 'progress-planner' );
	}

	/**
	 * Get external link URL.
	 *
	 * @return string
	 */
	public function get_external_link_url() {
		return $this->is_person_mode()
			? \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-organization-logo' )
			: \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-person-logo' );
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

		// If the site is for a company, and the company logo is already set, we don't need to add the task.
		if ( ! $this->is_person_mode()
			&& $this->yoast_seo->helpers->options->get( 'company_logo' ) // @phpstan-ignore-line property.nonObject
		) {
			return false;
		}

		// If the site is for a person, and the person logo is already set, we don't need to add the task.
		if ( $this->is_person_mode()
			&& $this->yoast_seo->helpers->options->get( 'person_logo' ) // @phpstan-ignore-line property.nonObject
		) {
			return false;
		}

		return true;
	}

	// Popover rendering methods removed - now handled by React SiteIconPopover component (yoast-organization-logo uses same component as site icon).

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		return $this->add_popover_action( $actions, \__( 'Set logo', 'progress-planner' ) );
	}
}
