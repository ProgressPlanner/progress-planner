<?php
/**
 * Add tasks for Core blogdescription.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for Core blogdescription.
 */
class Blog_Description extends Tasks {

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
	protected const PROVIDER_ID = 'core-blogdescription';

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set tagline', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return sprintf(
			/* translators: %s:<a href="https://prpl.fyi/set-tagline" target="_blank">tagline</a> link */
			\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
			'<a href="https://prpl.fyi/set-tagline" target="_blank">' . \esc_html__( 'tagline', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-general.php',
			'iconEl' => 'th:has(+td #tagline-description)',
		];
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return '' === \get_bloginfo( 'description' );
	}
}
