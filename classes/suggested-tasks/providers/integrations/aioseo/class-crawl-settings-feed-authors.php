<?php
/**
 * Add task for All in One SEO: disable author RSS feeds.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Task_Action_Builder;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_AIOSEO;

/**
 * Add task for All in One SEO: disable author RSS feeds.
 */
class Crawl_Settings_Feed_Authors extends AIOSEO_Interactive_Provider {

	use Task_Action_Builder;
	use Ajax_Security_AIOSEO;

	/**
	 * The minimum number of posts with a post format to add the task.
	 *
	 * @var int
	 */
	protected const MINIMUM_AUTHOR_WITH_POSTS = 1;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-crawl-settings-feed-authors';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'aioseo-crawl-settings-feed-authors';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Post_Author::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-crawl-optimization-feed-authors';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_aioseo-crawl-settings-feed-authors', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/advanced' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: disable author RSS feeds', 'progress-planner' );
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Check if AIOSEO is active.
		if ( ! \function_exists( 'aioseo' ) ) {
			return false;
		}

		// Check if task is still relevant.
		if ( ! $this->is_task_relevant() ) {
			return false;
		}

		// Check if crawl cleanup is enabled and author feeds are disabled.
		$disable_author_feed = \aioseo()->options->searchAppearance->advanced->crawlCleanup->feeds->authors;

		// Check if author feeds are already disabled.
		if ( $disable_author_feed === false ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		// If there is more than one author, we don't need to add the task.
		return $this->get_data_collector()->collect() <= self::MINIMUM_AUTHOR_WITH_POSTS;
	}

	/**
	 * Get the description.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'The author feed on your site will be similar to your main feed if you have only one author, so there\'s no reason to have it.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$this->print_submit_button( \__( 'Disable author RSS feeds', 'progress-planner' ) );
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change non-core settings.
	 * The $_POST data is expected to be:
	 * - nonce: (string) The nonce.
	 *
	 * @return void
	 */
	public function handle_interactive_task_specific_submit() {
		$this->verify_aioseo_ajax_security();

		\aioseo()->options->searchAppearance->advanced->crawlCleanup->feeds->authors = false; // @phpstan-ignore-line

		// Update the option.
		\aioseo()->options->save(); // @phpstan-ignore-line

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
		return $this->add_popover_action( $actions, \__( 'Disable', 'progress-planner' ) );
	}
}
