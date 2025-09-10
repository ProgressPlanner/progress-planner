<?php
/**
 * Add task for Yoast SEO: Remove emoji scripts.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: Remove emoji scripts.
 */
class Crawl_Settings_Emoji_Scripts extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-crawl-settings-emoji-scripts';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/yoast-crawl-optimization-emoji-scripts';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_emoji_scripts' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Yoast SEO: remove emoji scripts', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Remove JavaScript used for converting emoji characters in older browsers.', 'progress-planner' );
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
					'elementSelector' => 'button[data-id="input-wpseo-remove_emoji_scripts"]',
					'attributeName'   => 'aria-checked',
					'attributeValue'  => 'true',
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
		$yoast_options = \WPSEO_Options::get_instance()->get_all();
		foreach ( [ 'remove_emoji_scripts' ] as $option ) {
			// If the crawl settings are already optimized, we don't need to add the task.
			if ( $yoast_options[ $option ] ) {
				return false;
			}
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
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_emoji_scripts' ) . '" target="_blank">' . \esc_html__( 'Remove', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
