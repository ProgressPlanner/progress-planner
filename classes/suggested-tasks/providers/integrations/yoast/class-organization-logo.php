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
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person'
			? \esc_html__( 'Yoast SEO: set your organization logo', 'progress-planner' )
			: \esc_html__( 'Yoast SEO: set your person logo', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person'
			? \esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your organization logo in the Yoast SEO settings.', 'progress-planner' )
			: \esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your person logo in the Yoast SEO settings.', 'progress-planner' );
	}

	/**
	 * Get external link URL.
	 *
	 * @return string
	 */
	public function get_external_link_url() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person'
			? 'https://prpl.fyi/yoast-person-logo'
			: 'https://prpl.fyi/yoast-organization-logo';
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
		// If the site is for a person, and the person logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'company'
			&& $this->yoast_seo->helpers->options->get( 'company_logo' )
		) {
			return false;
		}

		// If the site is for a person, and the organization logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'person'
			&& $this->yoast_seo->helpers->options->get( 'person_logo' )
		) {
			return false;
		}

		return true;
	}

	/**
	 * Get the task actions.
	 *
	 * @param array $data The task data.
	 *
	 * @return array
	 */
	public function get_task_actions( $data = [] ) {
		$actions = parent::get_task_actions( $data );

		$actions['do'] = \progress_planner()->the_view(
			'actions/do.php',
			\array_merge(
				$data,
				[
					'task_action_text' => \esc_html__( 'Set logo', 'progress-planner' ),
					'url'              => \admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' ),
					'url_target'       => '_blank',
				]
			),
			true
		);
		return $actions;
	}
}
