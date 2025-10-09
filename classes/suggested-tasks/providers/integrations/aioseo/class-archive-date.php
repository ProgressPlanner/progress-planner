<?php
/**
 * Add task for All in One SEO: disable the date archive.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add task for All in One SEO: disable the date archive.
 */
class Archive_Date extends AIOSEO_Interactive_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-date-archive';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'aioseo-date-archive';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-date-archive';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_aioseo-date-archive', [ $this, 'handle_interactive_task_specific_submit' ] );
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
		return \esc_html__( 'All in One SEO: noindex the date archive', 'progress-planner' );
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

		// Check if date archives are already disabled in AIOSEO.
		// AIOSEO uses 'show' property - when false, archives are hidden from search results.
		$show_value = \aioseo()->options->searchAppearance->archives->date->show;

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
		// If the permalink structure includes %year%, %monthnum%, or %day%, we don't need to add the task.
		$permalink_structure = \get_option( 'permalink_structure' );
		return \strpos( $permalink_structure, '%year%' ) === false
			&& \strpos( $permalink_structure, '%monthnum%' ) === false
			&& \strpos( $permalink_structure, '%day%' ) === false;
	}

	/**
	 * Get the description.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Date archives rarely add any real value for users or search engines, so there\'s no reason for search engines to index these. That\'s why we suggest keeping them out of search results.', 'progress-planner' );
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
			<?php \esc_html_e( 'Noindex the date archive', 'progress-planner' ); ?>
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

		\aioseo()->options->searchAppearance->archives->date->show = false;

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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover();return false;">' . \esc_html__( 'Noindex', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
