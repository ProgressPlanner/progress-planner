<?php
/**
 * Add task for setting the FAQ page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for permalink structure.
 */
class Set_Page_FAQ extends Set_Page_Task {

	/**
	 * The page name.
	 *
	 * @var string
	 */
	protected const PAGE_NAME = 'faq';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'set-page-faq';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'set-page-faq';

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set the FAQ page', 'progress-planner' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'The FAQ page is a page that provides answers to frequently asked questions about your website. It is a great way to help your visitors find the information they need quickly and easily.', 'progress-planner' );
		echo '</p>';
	}
}
