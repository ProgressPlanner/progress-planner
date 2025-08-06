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
class Disable_Comments extends Tasks_Interactive {

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
	protected const PROVIDER_ID = 'disable-comments';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'disable-comments';

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
			'iconEl' => 'label[for="default_comment_status"]',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Disable comments', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \sprintf(
			\esc_html(
					// translators: %d is the number of approved comments, %s is the <a href="https://prpl.fyi/disable-comments" target="_blank">disabling them</a> link.
				\_n(
					'There is %1$d comment. If you don\'t need comments on your site, consider %2$s.',
					'There are %1$d comments. If you don\'t need comments on your site, consider %2$s.',
					(int) \wp_count_comments()->approved,
					'progress-planner'
				)
			),
			(int) \wp_count_comments()->approved,
			'<a href="https://prpl.fyi/disable-comments" target="_blank">' . \esc_html__( 'disabling them', 'progress-planner' ) . '</a>',
		);
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return ! \progress_planner()->get_plugin_installer()->is_plugin_activated( 'comment-free-zone' )
			&& 10 > \wp_count_comments()->approved
			&& 'open' === \get_default_comment_status();
	}

	/**
	 * Check if the task is completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return 'open' !== \get_default_comment_status();
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		$comments_count = (int) \wp_count_comments()->approved;

		echo '<p>';
		if ( 0 === $comments_count ) {
			\esc_html_e( 'Your site currently has no approved comments. Therefore, it seems your site might not need comments. If that is true for most posts or pages on your site, you can use WordPress\'s default setting to disable comments. If your site really doesn\'t need any comments, we recommend installing the "Comment-Free Zone" plugin.', 'progress-planner' );
		} else {
			printf(
				\esc_html(
					// translators: %d is the number of approved comments.
					\_n(
						'Your site currently has %d approved comment. Therefore, it seems your site might not need comments. If that is true for most posts or pages on your site, you can use WordPress\'s default setting to disable comments. If your site really doesn\'t need any comments, we recommend installing the "Comment-Free Zone" plugin.',
						'Your site currently has %d approved comments. Therefore, it seems your site might not need comments. If that is true for most posts or pages on your site, you can use WordPress\'s default setting to disable comments. If your site really doesn\'t need any comments, we recommend installing the "Comment-Free Zone" plugin.',
						$comments_count,
						'progress-planner'
					)
				),
				(int) $comments_count
			);
		}
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
			<?php \esc_html_e( 'Disable new comments', 'progress-planner' ); ?>
		</button>
		<prpl-install-plugin
			data-plugin-name="Comment-free zone"
			data-plugin-slug="comment-free-zone"
			data-action="<?php echo \progress_planner()->get_plugin_installer()->is_plugin_installed( 'comment-free-zone' ) ? 'activate' : 'install'; ?>"
			data-provider-id="<?php echo \esc_attr( self::PROVIDER_ID ); ?>"
		></prpl-install-plugin>
		<?php
	}
}
