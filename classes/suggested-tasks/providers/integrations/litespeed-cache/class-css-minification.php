<?php
/**
 * Add task for LiteSpeed Cache: enable CSS minification.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Litespeed_Cache;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Task_Action_Builder;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Litespeed_Cache;

/**
 * Add task for LiteSpeed Cache: enable CSS minification.
 */
class Css_Minification extends Litespeed_Cache_Interactive_Provider {

	use Task_Action_Builder;
	use Ajax_Security_Litespeed_Cache;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'litespeed-cache-css-minification';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'litespeed-cache-css-minification';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/litespeed-cache-css-minification';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_litespeed-cache-css-minification', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=litespeed-page_optm' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'LiteSpeed Cache: enable CSS minification', 'progress-planner' );
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		if ( ! \defined( 'LSCWP_V' ) ) {
			return false;
		}

		return ! (bool) $this->get_litespeed_option( 'optm-css_min' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'CSS minification removes unnecessary whitespace, comments, and formatting from your CSS files, reducing their size by 10-30%. This is a low-risk optimization that helps pages load faster by reducing the amount of data browsers need to download.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$this->print_submit_button( \__( 'Enable CSS minification', 'progress-planner' ) );
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * @return void
	 */
	public function handle_interactive_task_specific_submit() {
		$this->verify_litespeed_cache_ajax_security();

		$this->update_litespeed_option( 'optm-css_min', 1 );

		\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		return $this->add_popover_action( $actions, \__( 'Enable', 'progress-planner' ) );
	}
}
