<?php
/**
 * Add task to allow search engines to index the site.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task to allow search engines to index the site.
 */
class Search_Engine_Visibility extends Tasks {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'search-engine-visibility';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/blog-indexing-settings';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-reading.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-reading.php',
			'iconEl' => 'label[for="blog_public"]',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Allow your site to be indexed by search engines', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Your site is not currently visible to search engines. Consider allowing search engines to index your site.', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 === (int) \get_option( 'blog_public' );
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
					'task_action_text' => \esc_html__( 'Change setting', 'progress-planner' ),
					'url'              => \admin_url( 'options-reading.php' ),
					'url_target'       => '_self',
				]
			),
			true
		);

		return $actions;
	}
}
