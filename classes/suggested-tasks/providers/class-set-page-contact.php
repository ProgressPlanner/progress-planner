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
class Set_Page_Contact extends Set_Page_Task {

	/**
	 * The page name.
	 *
	 * @var string
	 */
	protected const PAGE_NAME = 'contact';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'set-page-contact';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'set-page-contact';

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set the Contact page', 'progress-planner' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'The Contact page is a page that provides a way for your visitors to contact you. It is a great way to help your visitors get in touch with you and ask questions.', 'progress-planner' );
		echo '</p>';
	}
}
