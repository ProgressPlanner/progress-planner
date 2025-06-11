<?php
/**
 * Add tasks for permalink structure.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for permalink structure.
 */
class Permalink_Structure extends Tasks {

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
	protected const PROVIDER_ID = 'core-permalink-structure';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-permalink.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		$icon_el = 'label[for="permalink-input-month-name"], label[for="permalink-input-post-name"]';

		// If the task is completed, we want to add icon element only to the selected option (not both).
		if ( $this->is_task_completed() ) {
			$permalink_structure = \get_option( 'permalink_structure' );

			if ( '/%year%/%monthnum%/%postname%/' === $permalink_structure || '/index.php/%year%/%monthnum%/%postname%/' === $permalink_structure ) {
				$icon_el = 'label[for="permalink-input-month-name"]';
			}

			if ( '/%postname%/' === $permalink_structure || '/index.php/%postname%/' === $permalink_structure ) {
				$icon_el = 'label[for="permalink-input-post-name"]';
			}
		}

		return [
			'hook'   => 'options-permalink.php',
			'iconEl' => $icon_el,
		];
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set permalink structure', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">We recommend</a> link */
			\esc_html__( 'On install, WordPress sets the permalink structure to a format that is not SEO-friendly. %1$s changing it.', 'progress-planner' ),
			'<a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>',
		);
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$permalink_structure = \get_option( 'permalink_structure' );
		return '/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure || '/index.php/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure;
	}
}
