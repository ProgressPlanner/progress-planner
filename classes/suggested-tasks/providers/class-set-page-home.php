<?php
/**
 * Add task for setting the Home page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for permalink structure.
 */
class Set_Page_Home extends Set_Page_Task {

	/**
	 * The page name.
	 *
	 * @var string
	 */
	protected const PAGE_NAME = 'homepage';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'set-page-home';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'set-page-home';

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set the Home page', 'progress-planner' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'The Home page is the first page that visitors see when they visit your website. It is a great way to welcome your visitors and introduce your website to them.', 'progress-planner' );
		echo '</p>';
	}
}
