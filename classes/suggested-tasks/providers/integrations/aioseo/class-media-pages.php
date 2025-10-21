<?php
/**
 * Add task for All in One SEO: redirect media/attachment pages.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add task for All in One SEO: redirect media/attachment pages.
 */
class Media_Pages extends AIOSEO_Interactive_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-media-pages';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'aioseo-media-pages';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-media-pages';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_aioseo-media-pages', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/media' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: redirect media/attachment pages to attachment', 'progress-planner' );
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

		// Check if redirect attachment URLs is already set to 'attachment'.
		// This setting is stored in aioseo_options_dynamic under:
		// searchAppearance -> postTypes -> attachment -> redirectAttachmentUrls.
		$redirect = \aioseo()->dynamicOptions->searchAppearance->postTypes->attachment->redirectAttachmentUrls;

		// The task is complete if redirectAttachmentUrls is set to 'attachment'.
		// Possible values: 'disabled', 'attachment', or 'attachmentParent'.
		// We recommend 'attachment' as it redirects to the attachment file itself.
		if ( 'attachment' === $redirect ) {
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
		\esc_html_e( 'WordPress creates a "page" for every image you upload. These don\'t add any value but do cause more crawling on your site, so we suggest removing those.', 'progress-planner' );
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
			<?php \esc_html_e( 'Redirect media pages', 'progress-planner' ); ?>
		</button>
		<?php
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
		if ( ! \function_exists( 'aioseo' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'AIOSEO is not active.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		\aioseo()->dynamicOptions->searchAppearance->postTypes->attachment->redirectAttachmentUrls = 'attachment';

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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover();return false;">' . \esc_html__( 'Redirect', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
