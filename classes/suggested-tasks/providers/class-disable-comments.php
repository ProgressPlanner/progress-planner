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
class Disable_Comments extends Tasks {

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
		return 10 > \wp_count_comments()->approved && 'open' === \get_default_comment_status();
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
}
