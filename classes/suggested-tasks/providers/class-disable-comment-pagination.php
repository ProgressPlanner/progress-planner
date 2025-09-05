<?php
/**
 * Add tasks for disabling comments.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks to disable comments.
 */
class Disable_Comment_Pagination extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'disable-comment-pagination';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'disable-comment-pagination';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/disable-comment-pagination';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-discussion.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-discussion.php',
			'iconEl' => 'label[for="page_comments"]',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Disable comment pagination', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \sprintf(
			/* translators: %d is the number of comments per page.*/
			\esc_html__( 'When comment pagination is enabled, your site creates a new page for every %d comments. This is not helping your website in search engines, and can break up the ongoing conversation. That\'s why we recommend to disable comment pagination.', 'progress-planner' ),
			(int) \get_option( 'comments_per_page' ),
		);
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return $this->are_dependencies_satisfied() && \get_option( 'page_comments' );
	}

	/**
	 * Check if the task is completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return ! \get_option( 'page_comments' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\printf(
			/* translators: %d is the number of comments per page, %s is the "recommend to disable comment pagination" link */
			\esc_html__( 'When comment pagination is enabled, your site creates a new page for every %1$d comments. This is not helping your website in search engines, and can break up the ongoing conversation. That\'s why we %2$s.', 'progress-planner' ),
			(int) \get_option( 'comments_per_page' ),
			'<a href="https://prpl.fyi/disable-comment-pagination" target="_blank">' . \esc_html__( 'recommend to disable comment pagination', 'progress-planner' ) . '</a>'
		);
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Disable comment pagination', 'progress-planner' ); ?>
		</button>
		<?php
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
			'priority' => 100,
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'' . \esc_attr( $data['meta']['prpl_popover_id'] ) . '\')?.showPopover()">' . \esc_html__( 'Disable pagination', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
