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
		\esc_html_e( 'An FAQ page answers common questions your visitors have, saving them time and reducing your support workload. It also helps with SEO by targeting long-tail search queries.', 'progress-planner' );
		echo '</p>';
		echo '<p>';
		\esc_html_e( 'You can set this page from the Sidebar on the Page Edit screen.', 'progress-planner' );
		echo '</p>';
	}
}
