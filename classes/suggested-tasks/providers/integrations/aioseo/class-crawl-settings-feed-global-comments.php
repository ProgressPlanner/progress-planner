<?php
/**
 * Add task for All in One SEO: disable global comment RSS feeds.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add task for All in One SEO: disable global comment RSS feeds.
 */
class Crawl_Settings_Feed_Global_Comments extends AIOSEO_Interactive_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-crawl-settings-feed-global-comments';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'aioseo-crawl-settings-feed-global-comments';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-crawl-optimization-feed-global-comments';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_aioseo-crawl-settings-feed-global-comments', [ $this, 'handle_interactive_task_specific_submit' ] );
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
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: disable global comment RSS feeds', 'progress-planner' );
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

		// Check if crawl cleanup is enabled and comment feeds are disabled.
		$disable_comment_feed = \aioseo()->options->searchAppearance->advanced->crawlCleanup->feeds->globalComments;

		// Check if comment feeds are already disabled.
		if ( $disable_comment_feed === false ) {
			return false;
		}

		return true;
	}

	/**
	 * Get the description.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Remove URLs which provide information about recent comments.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<button type="submit" class="prpl-button prpl-button-primary">
			<?php \esc_html_e( 'Disable global comment RSS feeds', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change non-core settings.
	 * The $_POST data is expected to be:
	 * - disable_global_comment_feed: (boolean) Just a boolean.
	 * - nonce: (string) The nonce.
	 *
	 * @return void
	 */
	public function handle_interactive_task_specific_submit() {
		if ( ! \function_exists( 'aioseo' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'AIOSEO is not active.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['disable_global_comment_feed'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing value.', 'progress-planner' ) ] );
		}

		$disable_global_comment_feed = \sanitize_text_field( \wp_unslash( $_POST['disable_global_comment_feed'] ) );

		if ( empty( $disable_global_comment_feed ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid global comment feed.', 'progress-planner' ) ] );
		}

		\aioseo()->options->searchAppearance->advanced->crawlCleanup->feeds->globalComments = false;

		// Update the option.
		\aioseo()->options->save();

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
		$actions[] = [
			'priority' => 10,
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover();return false;">' . \esc_html__( 'Disable', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
