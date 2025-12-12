<?php
/**
 * Add task for setting the About page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for permalink structure.
 */
class Set_Page_About extends Set_Page_Task {

	/**
	 * The page name.
	 *
	 * @var string
	 */
	protected const PAGE_NAME = 'about';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'set-page-about';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'set-page-about';

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set the About page', 'progress-planner' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Your About page tells your story. It tells your visitors who you are, what your business is, and why your website exists. It humanizes your business by telling visitors about yourself and your team.', 'progress-planner' );
		echo '</p>';
		echo '<p>';
		\esc_html_e( 'You can set this page from the Sidebar on the Page Edit screen.', 'progress-planner' );
		echo '</p>';
	}
}
