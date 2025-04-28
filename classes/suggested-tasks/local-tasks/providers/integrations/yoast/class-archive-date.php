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
	protected const PROVIDER_ID = 'yoast-date-archive';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url = \admin_url( 'admin.php?page=wpseo_page_settings#/date-archives' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Yoast SEO: disable the date archive', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Yoast SEO can disable the date archive, which is really only useful for news sites and blogs. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-date-archive" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
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
					'elementSelector' => 'button[data-id="input-wpseo_titles-disable-date"]',
					'attributeName'   => 'aria-checked',
					'attributeValue'  => 'false',
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

		// If the date archive is already disabled, we don't need to add the task.
		return YoastSEO()->helpers->options->get( 'disable-date' ) !== true;
	}

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		// If the permalink structure includes %year%, %monthnum%, or %day%, we don't need to add the task.
		$permalink_structure = \get_option( 'permalink_structure' );
		if ( strpos( $permalink_structure, '%year%' ) !== false || strpos( $permalink_structure, '%monthnum%' ) !== false || strpos( $permalink_structure, '%day%' ) !== false ) {
			return false;
		}

		return true;
	}
}
