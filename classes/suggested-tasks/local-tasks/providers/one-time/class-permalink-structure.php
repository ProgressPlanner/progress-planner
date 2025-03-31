<?php
/**
 * Add tasks for permalink structure.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for permalink structure.
 */
class Permalink_Structure extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'core-permalink-structure';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url         = \admin_url( 'options-permalink.php' );
		$this->title       = \esc_html__( 'Set permalink structure', 'progress-planner' );
		$this->description = sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">We recommend</a> link */
			\esc_html__( 'On install, WordPress sets the permalink structure to a format that is not SEO-friendly. %1$s changing it.', 'progress-planner' ),
			'<a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>',
		);

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

		$this->link_setting = [
			'hook'   => 'options-permalink.php',
			'iconEl' => $icon_el,
		];
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
