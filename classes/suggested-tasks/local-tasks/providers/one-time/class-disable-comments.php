<?php
/**
 * Add tasks for disabling comments.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks to disable comments.
 */
class Disable_Comments extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'disable-comments';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url          = \admin_url( 'options-discussion.php' );
		$this->link_setting = [
			'hook'   => 'options-discussion.php',
			'iconEl' => 'label[for="default_comment_status"]',
		];
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Disable comments', 'progress-planner' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
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
	 * @return bool
	 */
	public function is_task_completed() {
		return 'open' !== \get_default_comment_status();
	}
}
