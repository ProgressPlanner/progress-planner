<?php
/**
 * Add task for All in One SEO: disable the author archive.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Task_Action_Builder;
use Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_AIOSEO;

/**
 * Add task for All in One SEO: disable the author archive.
 */
class Archive_Author extends AIOSEO_Interactive_Provider {

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
	protected const PROVIDER_ID = 'aioseo-author-archive';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'aioseo-author-archive';

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
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-author-archive';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_aioseo-author-archive', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/archives' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: noindex the author archive', 'progress-planner' );
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

		// Check if task is still relevant (site has 1 or fewer authors).
		if ( ! $this->is_task_relevant() ) {
			return false;
		}

		// Check if author archives are already disabled in AIOSEO.
		// AIOSEO uses 'show' property - when false, archives are hidden from search results.
		// Get a fresh copy of the options to avoid caching issues.
		$show_value = \aioseo()->options->searchAppearance->archives->author->show;

		// If show is false (disabled), the task is complete (return false means don't add task).
		// Using loose comparison to handle string/int/bool variations.
		if ( ! $show_value ) {
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

	// Popover rendering methods removed - now handled by React AIOSEOPopover component.

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
		$this->verify_aioseo_active_or_fail();
		$this->verify_nonce_or_fail();

		\aioseo()->options->searchAppearance->archives->author->show = false; // @phpstan-ignore-line

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
		return $this->add_popover_action( $actions, \__( 'Noindex', 'progress-planner' ) );
	}
}
