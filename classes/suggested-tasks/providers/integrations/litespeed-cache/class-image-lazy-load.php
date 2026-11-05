<?php
/**
 * Add task for LiteSpeed Cache: enable image lazy loading.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Litespeed_Cache;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Task_Action_Builder;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Litespeed_Cache;

/**
 * Add task for LiteSpeed Cache: enable image lazy loading.
 */
class Image_Lazy_Load extends Litespeed_Cache_Interactive_Provider {

	use Task_Action_Builder;
	use Ajax_Security_Litespeed_Cache;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'litespeed-cache-image-lazy-load';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'litespeed-cache-image-lazy-load';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/litespeed-cache-image-lazy-load';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_litespeed-cache-image-lazy-load', [ $this, 'handle_interactive_task_specific_submit' ] );
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
		return \esc_html__( 'LiteSpeed Cache: enable image lazy loading', 'progress-planner' );
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

		return ! (bool) $this->get_litespeed_option( 'media-lazy' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Image lazy loading defers loading of images that are below the visible area of the page. Images are only loaded when the visitor scrolls near them. This significantly reduces initial page load time, especially on image-heavy pages.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$this->print_submit_button( \__( 'Enable image lazy loading', 'progress-planner' ) );
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * @return void
	 */
	public function handle_interactive_task_specific_submit() {
		$this->verify_litespeed_cache_ajax_security();

		$this->update_litespeed_option( 'media-lazy', 1 );

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
