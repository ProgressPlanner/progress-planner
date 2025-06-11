<?php
/**
 * Add task for Yoast SEO: disable the media pages.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: disable the media pages.
 */
class Media_Pages extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-media-pages';

	/**
	 * Get the task URL.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_url( $task_data = [] ) {
		return \admin_url( 'admin.php?page=wpseo_page_settings#/media-pages' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Yoast SEO: disable the media pages', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Yoast SEO can disable the media / attachment pages, which are the pages that show the media files. You really don\'t need them, except when you are displaying photos or art on your site through them. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-media-pages" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the Yoast SEO Media Pages', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
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
					'elementSelector' => 'button[data-id="input-wpseo_titles-disable-attachment"]',
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
		// If the media pages are already disabled, we don't need to add the task.
		return YoastSEO()->helpers->options->get( 'disable-attachment' ) !== true;
	}
}
