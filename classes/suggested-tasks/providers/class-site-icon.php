<?php
/**
 * Add tasks for Core siteicon.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for Core siteicon.
 */
class Site_Icon extends Tasks {

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
	protected const PROVIDER_ID = 'core-siteicon';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/set-site-icon';

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-general.php',
			'iconEl' => '.site-icon-section th',
		];
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set site icon', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Set the site icon to make your website look more professional.', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$site_icon = \get_option( 'site_icon' );
		return '' === $site_icon || '0' === $site_icon;
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
					'task_action_text' => \esc_html__( 'Go to the settings page', 'progress-planner' ),
					'url'              => \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() ),
					'url_target'       => '_self',
				]
			),
			true
		);

		return $actions;
	}
}
